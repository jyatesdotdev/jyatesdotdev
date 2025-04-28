'use client';

import { useState } from 'react';
import DOMPurify from 'dompurify';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface CommentFormProps {
  slug: string;
  onCommentSubmitted?: (comment: any) => void;
}

export function CommentForm({ slug, onCommentSubmitted }: CommentFormProps) {
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset status
    setError('');
    setSuccess('');

    // Validate input
    if (!authorName.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!authorEmail.trim() || !/^\S+@\S+\.\S+$/.test(authorEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!content.trim() || content.trim().length < 5) {
      setError('Please enter a comment (at least 5 characters).');
      return;
    }

    // Execute reCAPTCHA when the form is submitted
    if (!executeRecaptcha) {
      setError('reCAPTCHA not loaded. Please try again.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Get reCAPTCHA token
      const captchaToken = await executeRecaptcha('comment_form');

      if (!captchaToken) {
        setError('Failed to verify you are human. Please try again.');
        return;
      }

      // Sanitize content before sending to server
      const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
        ALLOWED_ATTR: ['href'],
      });

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          authorName,
          authorEmail,
          content: sanitizedContent,
          captcha: captchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit comment');
      }

      // Clear the form
      setAuthorName('');
      setAuthorEmail('');
      setContent('');

      // Show success message
      setSuccess('Comment submitted successfully and is awaiting approval.');

      // Call the callback if provided
      if (onCommentSubmitted) {
        onCommentSubmitted(data.comment);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded">{error}</div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Email * (won't be published)
          </label>
          <input
            type="email"
            id="email"
            value={authorEmail}
            onChange={e => setAuthorEmail(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
        >
          Comment *
        </label>
        <textarea
          id="comment"
          rows={4}
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white"
          required
        />
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Basic formatting is supported: <strong>bold</strong>, <em>italic</em>, and{' '}
          <a href="#" className="text-blue-500 underline">
            links
          </a>
          .
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Comment'}
      </button>
    </form>
  );
}
