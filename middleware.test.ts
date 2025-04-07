import { authMiddleware } from '@clerk/nextjs/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Mock NextRequest and NextResponse for testing
const mockRequest = (url: string, method: string) => {
  return new NextRequest(url, { method });
};

const mockResponse = () => {
  const res = new NextResponse();
  res.finished = false;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe('authMiddleware', () => {
  it('should handle unauthenticated requests to public routes', async () => {
    const middleware = authMiddleware({
      publicRoutes: ['/', '/api/webhooks(.*)'],
    });

    const req = mockRequest('/', 'GET');
    const res = mockResponse();

    await middleware(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });
});