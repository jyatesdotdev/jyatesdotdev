import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from 'app/lib/prisma';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Set up DOMPurify for server-side use
const window = new JSDOM('').window;
const purify = DOMPurify(window);

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

// Get comments for a blog post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Get the user's IP address to check if they liked comments
    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Only return approved comments to regular users
    const comments = await prisma.comment.findMany({
      where: { 
        slug: slug,
        status: 'approved'
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        content: true,
        authorName: true,
        createdAt: true,
        updatedAt: true,
        commentLikes: {
          select: {
            id: true,
            ipAddress: true
          }
        }
      }
    });

    // Transform the comments to include the count and user's like status
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      authorName: comment.authorName,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      commentLikes: comment.commentLikes.length,
      userHasLiked: comment.commentLikes.some(like => like.ipAddress === ipAddress)
    }));

    return NextResponse.json({ comments: formattedComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// Submit a new comment
export async function POST(request: NextRequest) {
  try {
    const { slug, authorName, authorEmail, content, captcha } = await request.json();

    // Validate required fields
    if (!slug || !authorName || !authorEmail || !content || !captcha) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Additional server-side sanitization for extra protection
    const sanitizedContent = purify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
      ALLOWED_ATTR: ['href']
    });

    // Get IP address for abuse prevention
    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Create the comment with pending status
    const comment = await prisma.comment.create({
      data: {
        slug,
        authorName,
        authorEmail,
        content: sanitizedContent,
        ipAddress,
        status: 'pending' // All comments start as pending
      }
    });

    // TODO: Add admin notification
    // await sendAdminNotification({
    //   type: 'new_comment',
    //   commentId: comment.id,
    //   postSlug: slug
    // });

    return NextResponse.json({ 
      message: 'Comment submitted successfully and is awaiting approval',
      comment: {
        id: comment.id,
        content: comment.content,
        authorName: comment.authorName,
        createdAt: comment.createdAt.toISOString(),
        status: comment.status
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to submit comment' },
      { status: 500 }
    );
  }
} 