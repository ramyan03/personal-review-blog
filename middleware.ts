import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Shuts the Keystatic admin when the site is reachable from outside this
 * machine.
 *
 * Keystatic runs in local git storage mode, which means /keystatic and its API
 * route read and write files in content/ and public/posters/ directly. That is
 * exactly what you want on localhost and exactly what you do not want on a
 * tunnel or a preview URL, where anyone holding the link could rewrite or
 * delete the reviews.
 *
 * Set PUBLIC_PREVIEW=1 whenever the server is exposed beyond this machine.
 */
export function middleware(request: NextRequest) {
  if (process.env.PUBLIC_PREVIEW !== "1") return NextResponse.next();

  return new NextResponse("Not found", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export const config = {
  matcher: ["/keystatic/:path*", "/api/keystatic/:path*"],
};
