import { ImageResponse } from 'next/og';
import { getBlogPosts } from 'app/blog/utils';
import { CustomMDX } from 'app/components/mdx';
import { join } from 'path';
import { readFileSync } from 'fs';

export async function GET(request: Request) {
  let url = new URL(request.url);
  let title = url.searchParams.get('title') || 'Software Engineer';
  let subtitle = url.searchParams.get('subtitle') || 'jyates.dev';
  let date = url.searchParams.get('date');
  let slug = url.searchParams.get('slug');
  let theme = url.searchParams.get('theme') || 'light';

  // Set theme colors based on preference
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#000000' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subtextColor = isDark ? '#888888' : '#666666';
  const accentColor = '#0070f3';
  const tagBgColor = isDark ? '#333333' : '#f3f4f6';
  const tagTextColor = isDark ? '#dddddd' : '#4b5563';
  const borderColor = isDark ? '#333333' : '#eaeaea';

  // Load profile image
  const profileImagePath = join(process.cwd(), 'public', 'images', 'profile.jpeg');
  const profileImageBuffer = readFileSync(profileImagePath);
  const profileImage = `data:image/jpeg;base64,${profileImageBuffer.toString('base64')}`;

  // If slug is provided, generate blog post snapshot
  if (slug) {
    const posts = await getBlogPosts();
    const post = posts.find(post => post.slug === slug);

    if (!post) {
      return new Response('Blog post not found', { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            padding: '2rem',
            background: bgColor,
            color: textColor,
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
          }}
        >
          {/* Header/Branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: `1px solid ${borderColor}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '9999px',
                overflow: 'hidden',
                marginRight: '0.75rem',
                border: `1px solid ${borderColor}`,
              }}
            >
              <img
                src={profileImage}
                width={40}
                height={40}
                alt="Profile picture"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <p style={{ fontSize: '1.1rem', color: accentColor, fontWeight: 500 }}>jyates.dev</p>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: textColor,
              lineHeight: 1.2,
            }}
          >
            {post.metadata.title}
          </h1>

          {/* Date */}
          <p
            style={{
              fontSize: '1rem',
              color: subtextColor,
              marginBottom: '1.5rem',
            }}
          >
            {date ||
              new Date(post.metadata.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
          </p>

          {/* Summary */}
          <p
            style={{
              fontSize: '1.25rem',
              lineHeight: 1.6,
              color: subtextColor,
              maxHeight: '300px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {post.metadata.summary}
          </p>

          {/* Tags if available */}
          {post.metadata.tags && post.metadata.tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginTop: '1.5rem',
              }}
            >
              {post.metadata.tags.slice(0, 4).map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: tagBgColor,
                    fontSize: '0.875rem',
                    color: tagTextColor,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '1rem',
              borderTop: `1px solid ${borderColor}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p style={{ fontSize: '0.875rem', color: subtextColor }}>
              Read the full article on jyates.dev
            </p>
            <div
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: accentColor,
                color: 'white',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Read more →
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // Default OG image logic (updated with theme)
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: bgColor,
          color: textColor,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: isDark
              ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Profile Picture */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            width: '8rem',
            height: '8rem',
            borderRadius: '9999px',
            overflow: 'hidden',
            border: `4px solid ${accentColor}`,
          }}
        >
          <img
            src={profileImage}
            width={128}
            height={128}
            alt="Profile picture"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            letterSpacing: '-0.025em',
            textAlign: 'center',
            marginBottom: '1rem',
            maxWidth: '56rem',
            color: textColor,
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <h2
          style={{
            fontSize: '1.5rem',
            color: accentColor,
            textAlign: 'center',
            marginBottom: date ? '0.5rem' : 0,
          }}
        >
          {subtitle}
        </h2>

        {/* Date */}
        {date && (
          <p
            style={{
              fontSize: '1.125rem',
              color: subtextColor,
              textAlign: 'center',
            }}
          >
            {date}
          </p>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
