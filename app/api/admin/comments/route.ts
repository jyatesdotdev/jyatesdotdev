import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from 'app/lib/prisma';

// Get all comments for admin moderation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    
    // Prepare the where clause based on status filter
    const whereClause = status !== 'all' 
      ? { status }
      : {};
    
    const comments = await prisma.comment.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments for admin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// Update comment status (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const { commentId, status } = await request.json();
    
    if (!commentId || !status) {
      return NextResponse.json(
        { error: 'Comment ID and status are required' },
        { status: 400 }
      );
    }
    
    // Validate status value
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Update the comment status
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { status }
    });
    
    return NextResponse.json({
      message: `Comment ${status} successfully`,
      comment: updatedComment
    });
  } catch (error) {
    console.error('Error updating comment status:', error);
    return NextResponse.json(
      { error: 'Failed to update comment status' },
      { status: 500 }
    );
  }
}

// Delete a comment
export async function DELETE(request: NextRequest) {
  try {
    const { commentId } = await request.json();
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }
    
    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId }
    });
    
    return NextResponse.json({
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
} 