import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/(dashboard)(.*)',
]);

export default clerkMiddleware((auth, req: NextRequest) => {
  if (isProtectedRoute(req)) auth.protect();
}, {
  publicRoutes: ["/", "/api/webhooks(.*)"]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

