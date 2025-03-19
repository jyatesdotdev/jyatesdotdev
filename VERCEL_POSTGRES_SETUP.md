# Setting up Vercel Postgres for the Blog Post Like Feature

This document provides instructions for setting up Vercel Postgres to store blog post likes in your portfolio application.

## Prerequisites

1. You need a Vercel account
2. Your project should be deployed on Vercel

## Steps to Set Up Vercel Postgres

1. **Create a Postgres Database in Vercel**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to the "Storage" tab
   - Click "Connect Store" and select "Postgres"
   - Follow the prompts to create a new Postgres database
   - Choose the region closest to your users

2. **Link the Database to Your Project**:
   - After creating the database, Vercel will automatically offer to connect it to your project
   - Click "Connect" to link the database

3. **Environment Variables**:
   - Vercel will automatically add these environment variables to your project:
     - `POSTGRES_URL` - The connection string for your database
     - `POSTGRES_URL_NON_POOLING` - A non-pooling connection string
     - `POSTGRES_USER` - The database user
     - `POSTGRES_HOST` - The database host
     - `POSTGRES_PASSWORD` - The database password
     - `POSTGRES_DATABASE` - The database name

4. **Update Your Project Configuration**:
   - In the Vercel dashboard, go to your project settings
   - Find "Environment Variables" section
   - Add a new environment variable: `DATABASE_URL` and set it to `${POSTGRES_URL}`
   - Add another environment variable: `DIRECT_URL` and set it to `${POSTGRES_URL_NON_POOLING}`

5. **Deploy Your Project**:
   - When you deploy your project, the `vercel-build` script in package.json will:
     - Generate the Prisma client
     - Apply any pending migrations to your Postgres database
     - Build your Next.js application

## Local Development

For local development, the application will continue to use SQLite:

- The `.env.development` file contains the configuration for local development
- The `DIRECT_URL` in this file points to a local SQLite database
- This setup allows you to develop locally without needing a Postgres server

## Testing

To test if your setup is working:

1. Visit a blog post page
2. Try liking the post by clicking the heart icon
3. Refresh the page and verify that the like count persists
4. Visit the same post from a different device or browser - you should be able to like it again (each IP address can like once)

## Troubleshooting

If you encounter issues:

1. Check the Vercel logs for any database-related errors
2. Verify that the environment variables are set correctly
3. Make sure the Prisma migrations were applied successfully
4. If needed, you can manually run migrations by opening the Vercel console and running: `npx prisma migrate deploy` 