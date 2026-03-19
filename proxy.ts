import { NextResponse, type NextRequest } from "next/server";

// Supabase derives cookie name from project URL: sb-{projectref}-auth-token
// URL: https://dyiifosinnnsyphknhpb.supabase.co → projectref: dyiifosinnnsyphknhpb
const SUPABASE_COOKIE_PREFIX = "sb-dyiifosinnnsyphknhpb-auth-token";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/auth");

  // Check for Supabase session cookie directly (no SDK needed, works reliably in Edge runtime)
  const allCookies = request.cookies.getAll();
  const hasSession = allCookies.some(
    (c) => c.name === SUPABASE_COOKIE_PREFIX || c.name.startsWith(`${SUPABASE_COOKIE_PREFIX}.`)
  );

  // Unauthenticated → send to login
  if (!hasSession && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Authenticated + on auth page → send home
  if (hasSession && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
