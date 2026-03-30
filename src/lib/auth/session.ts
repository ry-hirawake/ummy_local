/**
 * Session management using httpOnly cookies.
 * Reads/writes the ummy_session cookie via Next.js cookies() API.
 */

import { cookies } from "next/headers";
import { getAuthProvider } from "./auth-provider";
import type { SessionData } from "./types";

const COOKIE_NAME = "ummy_session";
const MAX_AGE = 86400; // 24 hours in seconds

/**
 * Get the current session from the cookie.
 * Returns null if no cookie, invalid token, or expired session.
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;

  const provider = getAuthProvider();
  return provider.validateSession(cookie.value);
}

/**
 * Set the session cookie with the given session data.
 */
export async function setSessionCookie(session: SessionData): Promise<void> {
  const provider = getAuthProvider();
  const token = provider.createToken(session);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/**
 * Delete the session cookie (logout).
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
