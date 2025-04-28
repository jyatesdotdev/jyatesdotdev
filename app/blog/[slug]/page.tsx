import { notFound } from 'next/navigation';
import { CustomMDX } from 'app/components/mdx';
import { formatDate, getBlogPosts } from 'app/blog/utils';
import { baseUrl } from 'app/sitemap';
import { LikeButton } from 'app/components/like-button';
import { cookies } from 'next/headers';
import { CommentSection } from 'app/components/comment-section';

export async function generateStaticParams() {
  let posts = await getBlogPosts();

  return posts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  let posts = await getBlogPosts();
  let post = posts.find(post => post.slug === params.slug);
  if (!post) {
    return;
  }

  let { title, publishedAt: publishedTime, summary: description, image } = post.metadata;

  // Get theme preference or default to light
  const cookieStore = cookies();
  const theme = cookieStore.get('theme')?.value || 'light';

  let formattedDate = await formatDate(post.metadata.publishedAt);

  // Use the post's image if provided, otherwise use the new snapshot OG image with theme
  let ogImage = image ? image : `${baseUrl}/og?slug=${params.slug}&theme=${theme}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params }) {
  let posts = await getBlogPosts();
  let post = posts.find(post => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Get theme preference or default to light
  const cookieStore = cookies();
  const theme = cookieStore.get('theme')?.value || 'light';

  const formattedDate = await formatDate(post.metadata.publishedAt);

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `${baseUrl}/og?slug=${params.slug}&theme=${theme}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'My Portfolio',
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">{post.metadata.title}</h1>
      <div className="flex flex-col mt-2 mb-8">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{formattedDate}</p>
        {post.metadata.tags && (
          <div className="flex flex-wrap mt-2 gap-1">
            {post.metadata.tags.map(tag => (
              <span
                key={tag}
                className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
      <LikeButton slug={post.slug} />

      <CommentSection slug={post.slug} />
    </section>
  );
}
