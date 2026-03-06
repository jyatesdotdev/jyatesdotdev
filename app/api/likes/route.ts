import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from 'app/lib/prisma';

// Get like count for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Count likes and check if current IP has liked concurrently
    const [likeCount, userHasLiked] = await Promise.all([
      prisma.postLike.count({
        where: { slug },
      }),
      prisma.postLike.findFirst({
        where: {
          slug,
          ipAddress,
        },
      }),
    ]);

    return NextResponse.json({
      likes: likeCount,
      userHasLiked: !!userHasLiked,
    });
  } catch (error) {
    console.error('Error getting like count:', error);
    return NextResponse.json({ error: 'Failed to get like count' }, { status: 500 });
  }
}

// Add a like to a post
export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Check if the user already liked this post
    const existingLike = await prisma.postLike.findFirst({
      where: {
        slug,
        ipAddress,
      },
    });

    if (existingLike) {
      // If already liked, remove the like (toggle functionality)
      await prisma.postLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      const updatedLikeCount = await prisma.postLike.count({
        where: { slug },
      });

      return NextResponse.json({
        likes: updatedLikeCount,
        userHasLiked: false,
      });
    }

    // Otherwise, add a new like
    await prisma.postLike.create({
      data: {
        slug,
        ipAddress,
      },
    });

    const updatedLikeCount = await prisma.postLike.count({
      where: { slug },
    });

    return NextResponse.json({
      likes: updatedLikeCount,
      userHasLiked: true,
    });
  } catch (error) {
    console.error('Error adding like:', error);
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 });
  }
}
