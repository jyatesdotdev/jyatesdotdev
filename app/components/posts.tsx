'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type BlogPost = {
  metadata: {
    title: string;
    publishedAt: string;
    formattedDate?: string;
    summary: string;
    image?: string;
    tags?: string[];
  };
  slug: string;
  content: string;
};

type BlogPostsProps = {
  initialPosts: BlogPost[];
  allPosts: BlogPost[];
  allTags: string[];
  selectedTag: string | null;
};

export function BlogPosts({
  initialPosts,
  allPosts,
  allTags,
  selectedTag: initialSelectedTag,
}: BlogPostsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(initialSelectedTag);

  // Filter blogs by selected tag
  const filteredBlogs = initialPosts;

  // Update URL when tag changes
  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);

    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set('tag', tag);
    } else {
      params.delete('tag');
    }

    // Reset to page 1
    params.set('page', '1');

    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1">
        {filteredBlogs
          .sort((a, b) => {
            if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
              return -1;
            }
            return 1;
          })
          .map(post => (
            <Link
              key={post.slug}
              className="flex flex-col space-y-1 mb-4"
              href={`/blog/${post.slug}`}
            >
              <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
                <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                  {post.metadata.formattedDate}
                </p>
                <div className="flex flex-col">
                  <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {post.metadata.title}
                  </p>
                  {post.metadata.tags && (
                    <div className="flex flex-wrap mt-1 gap-1">
                      {post.metadata.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded cursor-pointer"
                          onClick={e => {
                            e.preventDefault();
                            handleTagSelect(tag);
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
      </div>
      <aside className="w-full lg:w-64 lg:border-l lg:pl-6 lg:ml-6">
        <h3 className="font-semibold mb-4">Tags</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleTagSelect(null)}
              className={`text-sm hover:text-neutral-800 dark:hover:text-neutral-200 ${
                selectedTag === null
                  ? 'font-semibold text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              All Posts
            </button>
          </li>
          {allTags.map(tag => (
            <li key={tag}>
              <button
                onClick={() => handleTagSelect(tag)}
                className={`text-sm hover:text-neutral-800 dark:hover:text-neutral-200 ${
                  selectedTag === tag
                    ? 'font-semibold text-neutral-900 dark:text-neutral-100'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {tag} ({allPosts.filter(post => post.metadata.tags?.includes(tag)).length})
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
