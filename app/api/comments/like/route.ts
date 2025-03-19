import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from 'app/lib/prisma';

// Threshold for reCAPTCHA v3 score (0.0 to 1.0)
const RECAPTCHA_THRESHOLD = 0.5

async function verifyCaptcha(token: string) {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  })

  const data = await response.json()
  return {
    success: data.success,
    score: data.score
  }
}

// Toggle like on a comment
export async function POST(request: NextRequest) {
  try {
    const { commentId, captcha } = await request.json();

    if (!commentId || !captcha) {
      return NextResponse.json(
        { error: 'Comment ID and captcha token are required' },
        { status: 400 }
      );
    }
    
    // Verify CAPTCHA
    const captchaResult = await verifyCaptcha(captcha);
    
    // Check if captcha verification failed completely
    if (!captchaResult.success) {
      return NextResponse.json(
        { error: 'Invalid CAPTCHA' },
        { status: 400 }
      );
    }
    
    // Check if score is below threshold
    if (captchaResult.score < RECAPTCHA_THRESHOLD) {
      return NextResponse.json(
        { error: 'CAPTCHA score too low, please try again' },
        { status: 400 }
      );
    }

    // Get IP address to track likes
    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Check if the user already liked this comment
    const existingLike = await prisma.commentLike.findFirst({
      where: {
        commentId,
        ipAddress
      }
    });

    if (existingLike) {
      // If already liked, remove the like (toggle functionality)
      await prisma.commentLike.delete({
        where: {
          id: existingLike.id
        }
      });

      // Count the updated number of likes
      const likeCount = await prisma.commentLike.count({
        where: { commentId }
      });

      return NextResponse.json({
        likes: likeCount,
        userHasLiked: false
      });
    }

    // Otherwise, add a new like
    await prisma.commentLike.create({
      data: {
        commentId,
        ipAddress
      }
    });

    // Count the updated number of likes
    const likeCount = await prisma.commentLike.count({
      where: { commentId }
    });

    return NextResponse.json({
      likes: likeCount,
      userHasLiked: true
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    );
  }
} 