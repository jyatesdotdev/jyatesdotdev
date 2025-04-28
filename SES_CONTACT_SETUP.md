# Setting Up Contact Form with AWS SES

This guide explains how to set up the contact form functionality using Amazon Simple Email Service (SES).

## Prerequisites

1. An AWS account
2. Access to the AWS Management Console
3. A verified email address or domain in SES
4. Google reCAPTCHA v3 account (for spam protection)

## AWS SES Setup

### Step 1: Verify Your Email Address or Domain

1. Log in to the AWS Management Console and navigate to the SES service
2. In the left sidebar, click on "Verified identities"
3. Click on "Create identity"
4. Choose either "Email address" or "Domain" (domain recommended for production)
5. Follow the verification steps provided by AWS
6. Wait for verification to complete (email is immediate, domain may take up to 72 hours)

### Step 2: Create IAM User for SES Access

1. Navigate to the IAM service in AWS Console
2. Click on "Users" and then "Create user"
3. Provide a name (e.g., `portfolio-ses-user`)
4. Select "Programmatic access" for access type
5. Attach the `AmazonSESFullAccess` policy
6. Complete the user creation process
7. **Important**: Save the Access Key ID and Secret Access Key - you'll need these later

### Step 3: Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```
AWS_REGION=us-east-1  # Or your preferred AWS region
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
SES_FROM_EMAIL=your-verified-email@example.com
SES_TO_EMAIL=destination-email@example.com
```

### Step 4: Set Up Google reCAPTCHA v3

1. Go to the [Google reCAPTCHA admin console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account
3. Register a new site:
   - Enter a label for your site
   - Choose reCAPTCHA v3
   - Add your domain(s)
4. Click "Submit"
5. Copy the "Site Key" and "Secret Key"
6. Add these to your environment variables:

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

## Testing the Contact Form

1. Start your development server with `npm run dev`
2. Navigate to the contact page
3. Fill out the form with test data
4. Submit the form
5. Check for a success message
6. Verify that an email was received at your `SES_TO_EMAIL` address

## Troubleshooting

### Common Issues

1. **Email not sending**: 
   - Verify that your AWS credentials are correct
   - Check that your email addresses are verified in SES
   - If you're still in the SES sandbox, you can only send to verified email addresses

2. **reCAPTCHA errors**:
   - Ensure your site key is correctly configured as `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - Check browser console for JavaScript errors

3. **API errors**:
   - Check the network tab in your browser's developer tools
   - Look at server logs for detailed error messages

## Moving to Production

When moving to production, consider:

1. Moving out of the SES sandbox (requires an AWS support ticket)
2. Setting up proper domain verification
3. Configuring DKIM for better email deliverability
4. Implementing email templates for more professional responses

## Architecture

The contact form functionality consists of:

1. A React form component (`app/components/contact-form.tsx`)
2. reCAPTCHA integration for spam protection (`app/components/recaptcha-provider.tsx`)
3. Contact API endpoint (`app/api/contact/route.ts`)
4. SES email sending functionality (`app/lib/ses.ts`) 