/**
 * Authentication type definitions for Ummy.
 * Designed for provider-agnostic auth (mock now, Cognito later per ADR-0001).
 */

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export interface SessionData {
  user: AuthUser;
  expiresAt: number; // Unix timestamp in milliseconds
}

export interface AuthProviderInterface {
  /**
   * Authenticate a user by email.
   * Returns SessionData on success, null on failure.
   */
  authenticate(email: string): Promise<SessionData | null>;

  /**
   * Validate and decode a session token.
   * Returns SessionData if valid and not expired, null otherwise.
   */
  validateSession(token: string): Promise<SessionData | null>;

  /**
   * Encode session data into a token string.
   */
  createToken(session: SessionData): string;
}
