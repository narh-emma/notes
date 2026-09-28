import { NextRequest, NextResponse } from "next/server"

const hits = new Map<string, { count: number; resetAt: number }>()

export function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"
  const now = Date.now()
  const windowMs = 60_000     // 1 minute
  const limit = 30          // 30 requests per minute

  let entry = hits.get(ip)

  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs }
    hits.set(ip, entry)
  }

  entry.count++

  if (entry.count > limit) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",    
}