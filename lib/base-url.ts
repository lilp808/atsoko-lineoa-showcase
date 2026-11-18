import type { NextRequest } from "next/server";

/**
 * Resolve the app's public origin for LINE media URLs.
 * LINE requires HTTPS and rejects redirecting URLs — behind Vercel the
 * request itself looks like http://, so trust x-forwarded-* headers first.
 */
export function resolveBaseUrl(request: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  const fwdProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = (fwdProto || request.nextUrl.protocol.replace(/:$/, "") || "https").toLowerCase();

  const fwdHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = fwdHost || request.headers.get("host") || request.nextUrl.host;

  return `${proto}://${host}`;
}
