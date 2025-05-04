import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sendEmail } from 'app/lib/ses';

// Threshold for reCAPTCHA v3 score (0.0 to 1.0)
const RECAPTCHA_THRESHOLD = 0.5;

async function verifyCaptcha(token: string) {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });

  const data = await response.json();
  return {
    success: data.success,
    score: data.score,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, captcha } = await request.json();

    // Verify CAPTCHA
    const captchaResult = await verifyCaptcha(captcha);

    // Check if captcha verification failed completely
    if (!captchaResult.success) {
      return NextResponse.json({ error: 'Invalid CAPTCHA' }, { status: 400 });
    }

    // Check if score is below threshold
    if (captchaResult.score < RECAPTCHA_THRESHOLD) {
      return NextResponse.json(
        { error: 'CAPTCHA score too low, please try again' },
        { status: 400 }
      );
    }

    // Send email using AWS SES
    await sendEmail({ name, email, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
