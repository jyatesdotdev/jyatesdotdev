'use client';

import { useState, useEffect } from 'react';

interface LikeButtonProps {
  slug: string;
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(0);
  const [userHasLiked, setUserHasLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch initial like count
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/likes?slug=${slug}`);
        const data = await response.json();

        if (response.ok) {
          setLikes(data.likes);
          setUserHasLiked(data.userHasLiked);
        } else {
          console.error('Error fetching likes:', data.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching likes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikes();
  }, [slug]);

  // Handle like toggle
  const handleLike = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (response.ok) {
        setLikes(data.likes);
        setUserHasLiked(data.userHasLiked);
      } else {
        console.error('Error toggling like:', data.error || 'Server returned an error');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center mt-6 text-sm">
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center space-x-1 p-2 rounded-md transition-colors ${
          userHasLiked
            ? 'text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400'
            : 'text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
        }`}
        aria-label={userHasLiked ? 'Unlike this post' : 'Like this post'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={userHasLiked ? 'currentColor' : 'none'}
          stroke="currentColor"
          className="w-5 h-5"
          strokeWidth={userHasLiked ? '0' : '2'}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        <span>{isLoading ? '...' : likes}</span>
      </button>
    </div>
  );
}
