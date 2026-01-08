import { auth } from "./auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
  const isOnLoginPage = req.nextUrl.pathname === "/"

  // 1. Jika user mau masuk Dashboard TAPI belum login -> Tendang ke Login
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  // 2. Jika user SUDAH login TAPI buka halaman Login lagi -> Tendang ke Dashboard
  if (isOnLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
})

// Konfigurasi file mana saja yang harus dijaga satpam
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}