import { ImageResponse } from 'next/og';
import { getBlogPosts } from 'app/blog/utils';
import { join } from 'path';
import { readFileSync } from 'fs';

// Theme configuration
const themeConfig = {
  light: {
    bgColor: '#ffffff',
    textColor: '#000000',
    subtextColor: '#666666',
    tagBgColor: '#f3f4f6',
    tagTextColor: '#4b5563',
    borderColor: '#eaeaea',
  },
  dark: {
    bgColor: '#000000',
    textColor: '#ffffff',
    subtextColor: '#888888',
    tagBgColor: '#333333',
    tagTextColor: '#dddddd',
    borderColor: '#333333',
  },
};

const accentColor = '#0070f3';

// Common styles
const commonStyles = {
  container: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    width: '100%',
    height: '100%',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  },
};

// Utility function to load profile image
const loadProfileImage = () => {
  const profileImagePath = join(process.cwd(), 'public', 'images', 'profile.jpeg');
  const profileImageBuffer = readFileSync(profileImagePath);
  return `data:image/jpeg;base64,${profileImageBuffer.toString('base64')}`;
};

// Utility function to load OG background image
const loadOGBackground = () => {
  const ogImagePath = join(process.cwd(), 'public', 'images', 'og.png');
  const ogImageBuffer = readFileSync(ogImagePath);
  return `data:image/png;base64,${ogImageBuffer.toString('base64')}`;
};

// Blog post OG image component
const BlogPostOGImage = ({ post, date, theme }: { post: any; date?: string; theme: string }) => {
  const themeStyles = themeConfig[theme as keyof typeof themeConfig];

  return (
    <div
      style={{
        ...commonStyles.container,
        padding: '3rem',
        background: themeStyles.bgColor,
        color: themeStyles.textColor,
        position: 'relative',
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.5,
          backgroundImage: `url(${loadOGBackground()})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Darkened Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />

      {/* Content Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header/Branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '3rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3rem',
              height: '3rem',
              borderRadius: '9999px',
              overflow: 'hidden',
              marginRight: '1rem',
              border: `2px solid ${accentColor}`,
            }}
          >
            <img
              src={loadProfileImage()}
              width={48}
              height={48}
              alt="Profile picture"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <p style={{ fontSize: '1.25rem', color: accentColor, fontWeight: 600 }}>jyates.dev</p>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#ffffff',
            lineHeight: 1.1,
            maxWidth: '80%',
          }}
        >
          {post.metadata.title}
        </h1>

        {/* Date */}
        <p
          style={{
            fontSize: '1.25rem',
            color: '#ffffff',
            opacity: 0.8,
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
            fontSize: '1.5rem',
            lineHeight: 1.5,
            color: '#ffffff',
            opacity: 0.9,
            maxWidth: '80%',
            marginBottom: '2rem',
          }}
        >
          {post.metadata.summary}
        </p>

        {/* Tags */}
        {post.metadata.tags?.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}
          >
            {post.metadata.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  fontSize: '1rem',
                  color: '#ffffff',
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
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: accentColor,
              color: 'white',
              borderRadius: '9999px',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Read more →
          </div>
        </div>
      </div>
    </div>
  );
};

// Default OG image component
const DefaultOGImage = ({
  title,
  subtitle,
  date,
  theme,
}: {
  title: string;
  subtitle: string;
  date?: string;
  theme: string;
}) => {
  const themeStyles = themeConfig[theme as keyof typeof themeConfig];
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        ...commonStyles.container,
        alignItems: 'center',
        justifyContent: 'center',
        background: themeStyles.bgColor,
        color: themeStyles.textColor,
        position: 'relative',
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.5,
          backgroundImage: `url(${loadOGBackground()})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Darkened Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />

      {/* Content Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '3rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header/Branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '3rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3rem',
              height: '3rem',
              borderRadius: '9999px',
              overflow: 'hidden',
              marginRight: '1rem',
              border: `2px solid ${accentColor}`,
            }}
          >
            <img
              src={loadProfileImage()}
              width={48}
              height={48}
              alt="Profile picture"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <p style={{ fontSize: '1.25rem', color: accentColor, fontWeight: 600 }}>jyates.dev</p>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#ffffff',
            lineHeight: 1.1,
            maxWidth: '80%',
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <h2
          style={{
            fontSize: '1.75rem',
            color: accentColor,
            marginBottom: date ? '1rem' : 0,
            maxWidth: '80%',
          }}
        >
          {subtitle}
        </h2>

        {/* Date */}
        {date && (
          <p
            style={{
              fontSize: '1.25rem',
              color: '#ffffff',
              opacity: 0.8,
            }}
          >
            {date}
          </p>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: accentColor,
              color: 'white',
              borderRadius: '9999px',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Read more →
          </div>
        </div>
      </div>
    </div>
  );
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get('title') || 'Senior Software Engineer';
  const subtitle = url.searchParams.get('subtitle') || 'jyates.dev';
  const date = url.searchParams.get('date');
  const slug = url.searchParams.get('slug');
  const theme = url.searchParams.get('theme') || 'dark';

  // If slug is provided, generate blog post snapshot
  if (slug) {
    const posts = await getBlogPosts();
    const post = posts.find(post => post.slug === slug);

    if (!post) {
      return new Response('Blog post not found', { status: 404 });
    }

    return new ImageResponse(
      <BlogPostOGImage post={post} date={date || undefined} theme={theme} />,
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // Default OG image
  return new ImageResponse(
    <DefaultOGImage title={title} subtitle={subtitle} date={date || undefined} theme={theme} />,
    {
      width: 1200,
      height: 630,
    }
  );
}
