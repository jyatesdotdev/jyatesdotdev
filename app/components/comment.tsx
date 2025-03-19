'use client';

import { useState } from 'react';
import DOMPurify from 'dompurify';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface CommentProps {
  comment: {
    id: string;
    content: string;
    authorName: string;
    createdAt: string;
    commentLikes: number;
    userHasLiked?: boolean;
  };
}

export function Comment({ comment }: CommentProps) {
  const [likes, setLikes] = useState(comment.commentLikes || 0);
  const [userHasLiked, setUserHasLiked] = useState(comment.userHasLiked || false);
  const [isLiking, setIsLiking] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [error, setError] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Convert createdAt string to proper date format
  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Function to handle liking a comment
  const handleLike = async () => {
    setError('');

    // Execute reCAPTCHA
    if (!executeRecaptcha) {
      setError('reCAPTCHA not loaded. Please try again.');
      return;
    }

    try {
      setIsLiking(true);

      // Get reCAPTCHA token
      const captchaToken = await executeRecaptcha('comment_like');

      if (!captchaToken) {
        setError('Failed to verify you are human. Please try again.');
        return;
      }

      const response = await fetch(`/api/comments/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: comment.id,
          captcha: captchaToken,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to like comment');
      }

      const data = await response.json();
      setLikes(data.likes);
      setUserHasLiked(data.userHasLiked);
    } catch (error) {
      console.error('Error liking comment:', error);
      setError(error instanceof Error ? error.message : 'Failed to like comment');
    } finally {
      setIsLiking(false);
    }
  };

  // Function to handle sharing a comment
  const handleShare = async () => {
    setShowShareOptions(!showShareOptions);
  };

  // Function to copy comment link to clipboard
  const copyToClipboard = async () => {
    const url = `${window.location.href}#comment-${comment.id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Comment link copied to clipboard!');
      setShowShareOptions(false);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Function to share via navigator.share API if available
  const shareViaWebAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Comment by ${comment.authorName}`,
          text: comment.content.substring(0, 100) + (comment.content.length > 100 ? '...' : ''),
          url: `${window.location.href}#comment-${comment.id}`,
        });
        setShowShareOptions(false);
      } catch (err) {
        console.error('Failed to share: ', err);
      }
    } else {
      copyToClipboard();
    }
  };

  // Safely render the comment content with DOMPurify
  const sanitizedContent = DOMPurify.sanitize(comment.content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href'],
  });

  return (
    <div id={`comment-${comment.id}`} className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
      {error && <div className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</div>}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{comment.authorName}</h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{formattedDate}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center space-x-1 p-1 rounded 
              ${userHasLiked ? 'text-red-600 dark:text-red-500' : 'text-neutral-600 dark:text-neutral-400'}`}
            aria-label={userHasLiked ? 'Unlike comment' : 'Like comment'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={userHasLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              className="w-4 h-4"
              strokeWidth={userHasLiked ? '0' : '2'}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span className="text-xs">{likes}</span>
          </button>
          <button
            onClick={handleShare}
            className="text-neutral-600 dark:text-neutral-400 p-1"
            aria-label="Share comment"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        className="mt-2 prose prose-sm dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      {/* Share options dropdown */}
      {showShareOptions && (
        <div className="mt-2 bg-white dark:bg-neutral-800 rounded p-2 shadow">
          <ul className="space-y-1">
            <li>
              <button
                onClick={copyToClipboard}
                className="w-full text-left text-sm py-1 px-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
              >
                Copy link
              </button>
            </li>
            {'share' in navigator && (
              <li>
                <button
                  onClick={shareViaWebAPI}
                  className="w-full text-left text-sm py-1 px-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                >
                  Share via...
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
