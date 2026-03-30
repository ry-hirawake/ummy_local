/**
 * Auth provider factory.
 * Returns the appropriate auth provider based on environment.
 * Swap point for Cognito integration (ADR-0001).
 */

import type { AuthProviderInterface } from "./types";
import { MockAuthProvider } from "./mock-auth-provider";

let instance: AuthProviderInterface | null = null;

export function getAuthProvider(): AuthProviderInterface {
  if (!instance) {
    // TODO: When ADR-0001 is accepted, add Cognito provider branch here
    // e.g. if (process.env.AUTH_PROVIDER === "cognito") { ... }
    instance = new MockAuthProvider();
  }
  return instance;
}
