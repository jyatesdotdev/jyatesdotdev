import Image from 'next/image';
import Link from 'next/link';
import { RecentBlogPosts } from 'app/components/recent-blog-posts';
import { getBlogPosts, formatDate } from 'app/blog/utils';
import { libraryItems } from 'app/data/library';

export default async function Page() {
  // Fetch recent blog posts
  const allPosts = await getBlogPosts();

  // Pre-format dates on the server
  for (const post of allPosts) {
    post.metadata.formattedDate = await formatDate(post.metadata.publishedAt, false);
  }

  // Sort posts by date (newest first) and get the most recent 3
  const recentPosts = allPosts
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .slice(0, 3);

  // Get random library items
  const randomLibraryItems = [...libraryItems]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <section className="w-full">
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-10 mb-12">
        <div className="relative flex-shrink-1 aspect-square s:w-48 md:w-56 lg:w-64 xl:w-72">
          <Image
            src="/images/profile.jpeg"
            alt="Profile picture"
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
        <div className="flex-grow max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Jonathan Yates</h1>
          <h2 className="text-neutral-400 mb-4">Senior Software Developer at INVIDI Technologies</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Passionate about software development, cloud technologies, and continuous learning.
            Currently focused on building scalable microservices and mentoring fellow developers.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Latest Blog Posts */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Latest Blog Posts</h2>
            <Link href="/blog" className="text-neutral-400 hover:text-neutral-300 text-sm">
              View all posts →
            </Link>
          </div>
          <RecentBlogPosts posts={recentPosts} />
        </div>

        {/* Library Sampling */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">From the Library</h2>
            <Link href="/library" className="text-neutral-400 hover:text-neutral-300 text-sm">
              View library →
            </Link>
          </div>
          <div className="space-y-4">
            {randomLibraryItems.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Quick Links</h2>
          <div className="space-y-4">
            <Link
              href="/career"
              className="block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <h3 className="font-medium mb-2">View Career Timeline</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Explore my professional journey and achievements
              </p>
            </Link>
            <Link
              href="/contact"
              className="block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <h3 className="font-medium mb-2">Get in Touch</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Have a question or want to collaborate? Reach out!
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
