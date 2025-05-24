# Public Directory

This directory contains static assets. Files placed here will be served from the root path of the application.

## Usage

Place static assets (images, fonts, etc.) in this directory. They can be referenced like this:

```html
<Image
  src="/images/profile-family.jpeg"
  alt="Profile picture"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="rounded-full object-cover"
  priority
/>
```

## Common Asset Types

- Profile pictures
- Logos
- Favicon
- Fonts
- Other static images and files

## Best Practices

1. Use descriptive filenames
2. Optimize images before adding them
3. Consider using subdirectories for better organization (e.g., `/public/images/`, `/public/fonts/`) 
