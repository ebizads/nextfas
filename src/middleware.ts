import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
// export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/test/:path*",
    "/",
    "/dashboard",
    "/assets",
    "/historylogs",
    "/UserManagement/:path*",
    "/typemanagement",
    "/actiontypemanagement",
    "/scan",
  ],
}

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    // raw: true,
  })

  const userAgent = request.headers.get("user-agent") || ""
  const isMobile =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(userAgent)

  const { pathname } = request.nextUrl

  // Allow access to login page
  if (pathname === "/UserManagement/login") {
    return NextResponse.next()
  }

  if (pathname === "/UserManagement/forgot") {
    return NextResponse.next()
  }

  if (pathname === "/UserManagement/changePassword") {
    return NextResponse.next()
  }

  // If user is not authenticated, block access to protected routes
  if (!token) {
    console.log("YOU HAVE NO TOKEN")
    const url = request.nextUrl.clone()
    url.pathname = "/UserManagement/login"
    return NextResponse.redirect(url)
  }

  // Redirect mobile users trying to access /assets
  if (token && isMobile && pathname.startsWith("/assets")) {
    const url = request.nextUrl.clone()
    url.pathname = "/scan"
    return NextResponse.redirect(url)
  }

  // Redirect desktop users trying to access /assets
  // if (token && !isMobile && pathname.startsWith('/scan')) {
  //     const url = request.nextUrl.clone()
  //     url.pathname = '/assets'
  //     return NextResponse.redirect(url)
  // }

  return NextResponse.next()
}
