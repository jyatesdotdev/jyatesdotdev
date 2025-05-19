import { getBlogPosts } from 'app/blog/utils';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');

  // If slug is provided, check for the static blog post OG image
  if (slug) {
    const posts = await getBlogPosts();
    const post = posts.find(post => post.slug === slug);

    if (!post) {
      return new Response('Blog post not found', { status: 404 });
    }

    return NextResponse.redirect(new URL(`/images/og/blog/${slug}.png`, url.origin));
  }

  return NextResponse.redirect(new URL('/images/og/default.png', url.origin));
}
