import { NextRequest } from 'next/server';
import { POST } from '@/app/api/comments/route';
import { prisma } from '@/app/lib/prisma';

// Mock the prisma client
jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    comment: {
      create: jest.fn(),
    },
  },
}));

// Mock fetch for reCAPTCHA verification
global.fetch = jest.fn();

describe('POST /api/comments', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set environment variable needed for CAPTCHA
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret-key';
  });

  const createRequest = (body: any, ip: string = '127.0.0.1') => {
    return new NextRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': ip,
      },
    });
  };

  it('should return 400 if required fields are missing', async () => {
    // Missing content and captcha
    const req = createRequest({
      slug: 'test-post',
      authorName: 'John Doe',
      authorEmail: 'john@example.com',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should return 400 if CAPTCHA verification fails completely', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: false }),
    });

    const req = createRequest({
      slug: 'test-post',
      authorName: 'John Doe',
      authorEmail: 'john@example.com',
      content: 'This is a test comment.',
      captcha: 'invalid-token',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Invalid CAPTCHA');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.google.com/recaptcha/api/siteverify',
      expect.any(Object)
    );
  });

  it('should return 400 if CAPTCHA score is below threshold', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, score: 0.4 }),
    });

    const req = createRequest({
      slug: 'test-post',
      authorName: 'John Doe',
      authorEmail: 'john@example.com',
      content: 'This is a test comment.',
      captcha: 'low-score-token',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('CAPTCHA score too low, please try again');
  });

  it('should create a comment successfully and return 201 with valid data', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, score: 0.9 }),
    });

    const mockDate = new Date('2024-01-01T00:00:00.000Z');
    const mockCreatedComment = {
      id: 1,
      slug: 'test-post',
      authorName: 'John Doe',
      authorEmail: 'john@example.com',
      content: 'Sanitized <b>content</b>',
      ipAddress: '127.0.0.1',
      status: 'pending',
      createdAt: mockDate,
      updatedAt: mockDate,
    };

    (prisma.comment.create as jest.Mock).mockResolvedValueOnce(mockCreatedComment);

    const req = createRequest({
      slug: 'test-post',
      authorName: 'John Doe',
      authorEmail: 'john@example.com',
      content: 'Sanitized <script>alert("xss")</script><b>content</b>',
      captcha: 'valid-token',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.message).toBe('Comment submitted successfully and is awaiting approval');
    expect(data.comment).toEqual({
      id: 1,
      content: 'Sanitized <b>content</b>',
      authorName: 'John Doe',
      createdAt: mockDate.toISOString(),
      status: 'pending',
    });

    expect(prisma.comment.create).toHaveBeenCalledWith({
      data: {
        slug: 'test-post',
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
        content: 'Sanitized <b>content</b>',
        ipAddress: '127.0.0.1',
        status: 'pending',
      },
    });
  });

  it('should return 500 if database creation fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, score: 0.9 }),
    });

    (prisma.comment.create as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const req = createRequest({
      slug: 'test-post',
      authorName: 'John Doe',
      authorEmail: 'john@example.com',
      content: 'This is a test comment.',
      captcha: 'valid-token',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Failed to submit comment');

    consoleSpy.mockRestore();
  });
});
