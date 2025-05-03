# Personal Site

Current site features include:

- MDX and Markdown support
- Optimized for SEO (sitemap, robots, JSON-LD schema)
- RSS Feed
- Dynamic OG images
- Syntax highlighting
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geist font
- Blog post "likes" feature

## Setting Up Blog Post Likes

This project includes a feature for viewers to "like" blog posts. The implementation:
- Uses SQLite for local development
- Uses Vercel Postgres for production
- Prevents duplicate likes from the same IP address
- Includes a heart icon that toggles state and shows the total count

### Local Development

The likes system works out of the box for local development using SQLite. Run the development server with:

```bash
npm run dev
```

### Production Deployment with Vercel Postgres

For production, you'll need to set up Vercel Postgres:

1. In your Vercel project dashboard, go to "Storage"
2. Click "Create" and select "Postgres"
3. Follow the setup process to create a new database
4. Connect it to your project when prompted
5. In your project's Environment Variables, make sure `DATABASE_URL` is set to `${POSTGRES_URL}`

For detailed instructions, see [VERCEL_POSTGRES_SETUP.md](./VERCEL_POSTGRES_SETUP.md)

## ReCAPTCHA v3 Protection

This project uses Google reCAPTCHA v3 to protect against spam and abuse. The protection is applied site-wide to:

- Contact form submissions
- Comment submissions
- Comment like interactions

### Setup Instructions

1. Go to the [Google reCAPTCHA admin console](https://www.google.com/recaptcha/admin)
2. Register a new site
3. Choose reCAPTCHA v3
4. Add your domain(s) and complete the registration
5. Set the following environment variables:
   ```
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
   RECAPTCHA_SECRET_KEY=your_secret_key
   ```

For more detailed instructions, see [SES_CONTACT_SETUP.md](./SES_CONTACT_SETUP.md)
