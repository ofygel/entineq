import { describe, it, expect, vi } from 'vitest';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } })
    },
    from: vi.fn()
  })
}));

const { GET } = await import('./route');

describe('GET /api/orders', () => {
  it('returns 401 when unauthenticated', async () => {
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://example.com/api/orders');
    const res = await GET(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ error: 'unauthorized' });
  });
});
