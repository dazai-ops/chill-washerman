import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ['/login']

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl
  const isLoggedIn = request.cookies.get('auth')?.value === 'true'

  if(pathname === '/'){
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  
  if(isLoggedIn && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if(!isLoggedIn && !PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/admin/:path*',
    '/mesin-cuci/:path*',
    '/jenis-pakaian/:path*',
    '/transaksi/:path*'
  ]
}