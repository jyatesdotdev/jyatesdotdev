import './global.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Navbar } from './components/nav';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Footer from './components/footer';
import { baseUrl } from './sitemap';
import { ReCaptchaProvider } from './components/recaptcha-provider';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'jyates.dev | Software Engineer',
    template: '%s | jyates.dev',
  },
  description: 'This is my portfolio.',
  openGraph: {
    title: 'My Portfolio',
    description: 'A place to showcase my work history, projects, thoughts, and experiences.',
    url: baseUrl,
    siteName: 'jyates.dev',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body className="antialiased max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-4 mt-8 sm:mx-auto">
        <ReCaptchaProvider>
          <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
            <Navbar />
            {children}
            <Footer />
          </main>
        </ReCaptchaProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
