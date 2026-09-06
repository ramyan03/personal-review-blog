import { NextResponse } from "next/server";

/**
 * Shuts the Keystatic admin anywhere the site is not just running on this
 * machine.
 *
 * Keystatic is in local git storage mode, so /keystatic and its API read and
 * write files in content/ and public/posters/ directly. That is what you want
 * on localhost and never what you want anywhere else: on a tunnel or a preview
 * URL anyone holding the link could rewrite the reviews, and on a deployment
 * the filesystem is read only so the CMS cannot work anyway.
 *
 * VERCEL is set on every deployment, so this needs no configuring there and
 * cannot be forgotten. PUBLIC_PREVIEW covers serving from this machine through
 * a tunnel, which nothing can detect on its own.
 */
export function middleware() {
  const exposed =
    process.env.VERCEL === "1" || process.env.PUBLIC_PREVIEW === "1";

  if (!exposed) return NextResponse.next();

  return new NextResponse("Not found", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export const config = {
  matcher: ["/keystatic/:path*", "/api/keystatic/:path*"],
};
