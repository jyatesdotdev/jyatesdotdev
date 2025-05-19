# OG Images Implementation

This document describes the implementation of static OG (Open Graph) images for the website.

## Overview

OG images are used by social media platforms when links to the website are shared. Previously, these images were generated dynamically using Next.js's ImageResponse API. The implementation has been changed to use pre-stored static images instead.

## Directory Structure

Static OG images are stored in the following directory structure:

```
public/
  images/
    og/
      home.png         # OG image for the home page
      default.png      # Default OG image
      blog/
        [slug].png     # OG images for blog posts, named after their slugs
```

## Implementation Details

1. The OG route (`app/og/route.tsx`) has been modified to:
   - Check if a static OG image exists for the requested page
   - If it exists, redirect to the static image
   - If it doesn't exist, fall back to dynamically generating the image

2. References to OG images in the codebase have been updated to use the static image URLs directly:
   - Home page: `/images/og/home.png`
   - Blog posts: `/images/og/blog/[slug].png`
   - Default: `/images/og/default.png`

## Adding New OG Images

When adding a new blog post, create a corresponding OG image and save it at:
```
public/images/og/blog/[slug].png
```

Where `[slug]` is the slug of the blog post.

## Testing

To test the implementation:
1. Start the development server: `npm run dev`
2. Visit the following URLs to verify that the correct OG images are being served:
   - Home page: `http://localhost:3000/og?homepage=true`
   - Blog post: `http://localhost:3000/og?slug=an-introduction`
   - Default: `http://localhost:3000/og`

## Fallback Behavior

If a static OG image doesn't exist for a requested page, the system will fall back to dynamically generating the image using the previous implementation. This ensures backward compatibility and prevents broken images.