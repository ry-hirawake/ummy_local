/**
 * Mock authentication provider for local development.
 * Email-only login (no password) with fixed user list.
 * Will be replaced by Cognito provider when ADR-0001 is accepted.
 */

import type { AuthProviderInterface, AuthUser, SessionData } from "./types";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fixed mock users aligned with existing mock data (mock-data.ts, community-data.ts).
 */
const MOCK_USERS: AuthUser[] = [
  {
    id: "user-1",
    email: "tanaka@ummy.example.com",
    name: "田中 美咲",
    avatar:
      "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "user-2",
    email: "sato@ummy.example.com",
    name: "佐藤 健太",
    avatar:
      "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0MjMyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "user-3",
    email: "suzuki@ummy.example.com",
    name: "鈴木 愛",
    avatar:
      "https://images.unsplash.com/photo-1507611268508-bf74edce9029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcyNDc2OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

function encodeBase64Url(data: string): string {
  return Buffer.from(data, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeBase64Url(encoded: string): string {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded, "base64").toString("utf-8");
}

export class MockAuthProvider implements AuthProviderInterface {
  async authenticate(email: string): Promise<SessionData | null> {
    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) return null;

    return {
      user,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
  }

  async validateSession(token: string): Promise<SessionData | null> {
    try {
      const json = decodeBase64Url(token);
      const session: SessionData = JSON.parse(json);

      if (!session.user?.id || !session.user?.email || !session.expiresAt) {
        return null;
      }

      if (Date.now() > session.expiresAt) {
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  createToken(session: SessionData): string {
    return encodeBase64Url(JSON.stringify(session));
  }
}

export { MOCK_USERS };
