import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const publicRoutes = ['/login', '/signup'];

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated } = await auth();

  console.log(req.nextUrl.pathname);

  if (!isAuthenticated && !publicRoutes.includes(req.nextUrl.pathname)) {
    console.log('Unauthorized');
    return NextResponse.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
