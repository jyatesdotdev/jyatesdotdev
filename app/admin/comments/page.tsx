'use client';

import { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { Comment } from '@prisma/client';

export default function CommentModeration() {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/comments?status=${filter}`);

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (commentId, status) => {
    try {
      const response = await fetch('/api/admin/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update comment status');
      }

      // Refresh the comments list
      fetchComments();
    } catch (error) {
      console.error('Error updating comment status:', error);
      alert('Failed to update comment status');
    }
  };

  const handleDelete = async commentId => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/comments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      // Refresh the comments list
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  // Format date for display
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Comment Moderation</h1>

      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-md ${
              filter === 'approved'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-md ${
              filter === 'rejected'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
            }`}
          >
            Rejected
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Loading comments...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded-md">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
          <p>No {filter !== 'all' ? filter : ''} comments found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment: Comment) => (
            <div
              key={comment.id}
              className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{comment.authorName}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Email: {comment.authorEmail}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    IP: {comment.ipAddress}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Post:{' '}
                    <a href={`/blog/${comment.slug}`} className="underline">
                      {comment.slug}
                    </a>
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Date: {formatDate(comment.createdAt)}
                  </p>
                  <p className="text-sm">
                    Status:{' '}
                    <span
                      className={`font-medium ${
                        comment.status === 'approved'
                          ? 'text-green-600 dark:text-green-400'
                          : comment.status === 'rejected'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                      }`}
                    >
                      {comment.status}
                    </span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  {comment.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(comment.id, 'approved')}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                  {comment.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(comment.id, 'rejected')}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="px-3 py-1 bg-neutral-600 text-white text-sm rounded-md hover:bg-neutral-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 prose prose-sm dark:prose-invert max-w-none border-t border-neutral-200 dark:border-neutral-700 pt-3">
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.content) }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
