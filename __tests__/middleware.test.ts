import { middleware } from '../middleware';
import { NextRequest } from 'next/server';

describe('Middleware Authentication', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 'password';
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should protect /admin routes', () => {
    const request = new NextRequest(new URL('http://localhost/admin/comments'));
    const response = middleware(request);

    expect(response.status).toBe(401);
  });

  it('should protect /api/admin routes', () => {
    const request = new NextRequest(new URL('http://localhost/api/admin/comments'));
    const response = middleware(request);

    expect(response.status).toBe(401);
  });

  it('should allow /admin routes with correct credentials', () => {
    const auth = Buffer.from('admin:password').toString('base64');
    const request = new NextRequest(new URL('http://localhost/admin/comments'), {
      headers: {
        authorization: `Basic ${auth}`,
      },
    });
    const response = middleware(request);

    // When authorized, it should return the next response (usually status 200 in mock)
    expect(response.status).toBe(200);
  });
});
