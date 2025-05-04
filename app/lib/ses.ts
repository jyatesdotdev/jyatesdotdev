import { SESClient, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-ses';

const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL;
const SES_TO_EMAIL = process.env.SES_TO_EMAIL;

if (!AWS_REGION) throw new Error('AWS_REGION is required');
if (!AWS_ACCESS_KEY_ID) throw new Error('AWS_ACCESS_KEY_ID is required');
if (!AWS_SECRET_ACCESS_KEY) throw new Error('AWS_SECRET_ACCESS_KEY is required');
if (!SES_FROM_EMAIL) throw new Error('SES_FROM_EMAIL is required');
if (!SES_TO_EMAIL) throw new Error('SES_TO_EMAIL is required');

const sesClient = new SESClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

interface EmailParams {
  name: string;
  email: string;
  message: string;
}

export async function sendEmail({ name, email, message }: EmailParams) {
  const params: SendEmailCommandInput = {
    Source: SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [SES_TO_EMAIL as string],
    },
    ReplyToAddresses: [email],
    Message: {
      Subject: {
        Data: `New Contact Form Message from ${name}`,
        Charset: 'UTF-8',
      },
      Body: {
        Text: {
          Data: `
Name: ${name}
Email: ${email}

Message:
${message}
          `,
          Charset: 'UTF-8',
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
