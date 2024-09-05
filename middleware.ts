import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that should be protected
const protectedPaths = ["/dashboard"];

export async function middleware(req: NextRequest) {
  // Get the token from the user's cookies
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Check if the user is trying to access a protected path
  const isAccessingProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isAccessingProtectedPath && !token) {
    // Redirect to login if no token found and trying to access a protected page
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url); // Preserve the original path for redirection after login
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to continue if the token is present or the path is not protected
  return NextResponse.next();
}

// Apply the middleware to the /dashboard/* route
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    "/dashboard/:path*",
  ],
};
