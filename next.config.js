/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'blog.domain.com',
            },
          ],
          destination: '/blog/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig 