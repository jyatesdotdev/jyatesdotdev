'use client';

import Link from 'next/link';
import Image from 'next/image';

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
};

type RecentBlogPostsProps = {
  posts: BlogPost[];
};

export function RecentBlogPosts({ posts }: RecentBlogPostsProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-neutral-400">No blog posts available.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link 
          key={post.slug} 
          href={`/blog/${post.slug}`}
          className="flex flex-col rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          {post.metadata.image && (
            <div className="relative w-full h-40">
              <Image
                src={post.metadata.image}
                alt={post.metadata.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4 flex-grow flex flex-col">
            <h3 className="font-medium text-lg mb-2">{post.metadata.title}</h3>
            <p className="text-neutral-400 text-sm mb-3 line-clamp-2">{post.metadata.summary}</p>
            <p className="text-neutral-500 text-xs mt-auto">{post.metadata.formattedDate}</p>
            {post.metadata.tags && post.metadata.tags.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {post.metadata.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
                {post.metadata.tags.length > 2 && (
                  <span className="text-xs text-neutral-400">+{post.metadata.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
} 