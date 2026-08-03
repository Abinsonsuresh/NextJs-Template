import { NextResponse } from "next/server"

const AUTH_ROUTES = ["/dashboard"]
const UNAUTH_ROUTES = ["/auth"]

export function proxy(request) {
  const token = request.cookies.get("authToken")?.value
  const { pathname } = request.nextUrl

  const isAuthRoute = AUTH_ROUTES.some((path) => pathname.startsWith(path))
  const isUnauthRoute = UNAUTH_ROUTES.some((path) => pathname.startsWith(path))

  if (isAuthRoute && !token) {
    const loginUrl = new URL("/auth", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isUnauthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}
