import { BlogPosts } from 'app/components/posts';
import { getBlogPosts, formatDate } from 'app/blog/utils';
import { Suspense } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
};

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; tag?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const selectedTag = searchParams.tag || null;
  const pageSize = 10;

  const allPosts = await getBlogPosts();

  // Pre-format dates on the server
  for (const post of allPosts) {
    post.metadata.formattedDate = await formatDate(post.metadata.publishedAt, false);
  }

  // Sort posts by date (newest first)
  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  // Extract all unique tags from all posts
  const allTags = new Set<string>();
  allPosts.forEach(post => {
    post.metadata.tags?.forEach(tag => {
      allTags.add(tag);
    });
  });

  // Filter posts if a tag is selected
  const filteredPosts = selectedTag
    ? sortedPosts.filter(post => post.metadata.tags?.includes(selectedTag))
    : sortedPosts;

  // Calculate pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / pageSize);

  // Get posts for current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Build URL query params for pagination links
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (selectedTag) {
      params.set('tag', selectedTag);
    }
    return `/blog?${params.toString()}`;
  };

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts
        initialPosts={currentPosts}
        allPosts={allPosts}
        allTags={Array.from(allTags).sort()}
        selectedTag={selectedTag}
      />

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div>
            {currentPage > 1 && (
              <Link
                href={buildPageUrl(currentPage - 1)}
                className="text-sm px-3 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                Previous
              </Link>
            )}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Page {currentPage} of {totalPages}
          </div>
          <div>
            {currentPage < totalPages && (
              <Link
                href={buildPageUrl(currentPage + 1)}
                className="text-sm px-3 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
