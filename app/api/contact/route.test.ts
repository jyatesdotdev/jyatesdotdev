import { POST } from './route';
import { NextRequest } from 'next/server';
import { sendEmail } from '@/app/lib/ses';

// Mock dependencies
jest.mock('@/app/lib/ses', () => ({
  sendEmail: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('POST /api/contact', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, RECAPTCHA_SECRET_KEY: 'test-secret' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const createMockRequest = (body: any) => {
    return {
      json: jest.fn().mockResolvedValue(body),
    } as unknown as NextRequest;
  };

  it('returns 200 on successful submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ success: true, score: 0.9 }),
    });

    const request = createMockRequest({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello!',
      captcha: 'valid-token',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });

    // Check if fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.google.com/recaptcha/api/siteverify',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'secret=test-secret&response=valid-token',
      })
    );

    // Check if sendEmail was called
    expect(sendEmail).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello!',
    });
  });

  it('returns 400 when captcha verification fails completely', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ success: false, score: 0 }),
    });

    const request = createMockRequest({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello!',
      captcha: 'invalid-token',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Invalid CAPTCHA' });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('returns 400 when captcha score is below threshold', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ success: true, score: 0.4 }),
    });

    const request = createMockRequest({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello!',
      captcha: 'low-score-token',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'CAPTCHA score too low, please try again' });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('returns 500 when an error occurs during processing', async () => {
    // Suppress console.error for this test expected to throw
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Force an error in request.json()
    const request = {
      json: jest.fn().mockRejectedValueOnce(new Error('Failed to parse JSON')),
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to process request' });
    expect(sendEmail).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
