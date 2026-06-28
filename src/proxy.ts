import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // Alternatively, check if you sync Zustand store to cookies

  // Example: Protect all routes starting with /dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Simple edge check for token. Granular check happens in RouteGuard.
    // If you are only keeping token in local storage, Next.js middleware won't see it.
    // In that case, you rely on the client-side RouteGuard or sync token to cookies on login.
    
    // For now, this is a placeholder. If token is required at Edge, uncomment below:
    /*
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    */
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
