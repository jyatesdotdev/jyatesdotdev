'use client';

import { useState, useEffect } from 'react';
import { Comment } from './comment';
import { CommentForm } from './comment-form';

interface CommentSectionProps {
  slug: string;
}

interface CommentType {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  commentLikes: number;
  userHasLiked?: boolean;
  status?: string;
}

export function CommentSection({ slug }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch comments for this post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/comments?slug=${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Unable to load comments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [slug]);

  const handleNewComment = (newComment: CommentType) => {
    // Only show the new comment in the UI if it's approved (which won't be the case initially)
    // This prevents the comment from appearing then disappearing when the page refreshes
    if (newComment.status === 'approved') {
      setComments(prevComments => [...prevComments, newComment]);
    }
  };

  return (
    <div className="mt-12 space-y-8">
      <h2 className="text-xl font-semibold tracking-tight">Comments</h2>

      {isLoading ? (
        <p className="text-neutral-600 dark:text-neutral-400">Loading comments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <p className="text-neutral-600 dark:text-neutral-400">
          No comments yet. Be the first to comment!
        </p>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Leave a comment</h3>
        <CommentForm slug={slug} onCommentSubmitted={handleNewComment} />
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          Comments are moderated and will appear after approval.
        </p>
      </div>
    </div>
  );
}
