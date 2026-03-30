/**
 * Repository factory.
 * Returns the appropriate repository set based on config.
 * Singleton pattern aligned with auth-provider.ts.
 */

import type { Repositories } from "./types";
import { getConfig } from "@/lib/config";
import { createInMemoryRepositories } from "./in-memory";

let instance: Repositories | null = null;

export function getRepositories(): Repositories {
  if (instance) return instance;

  const config = getConfig();

  if (config.provider === "postgres") {
    // TODO: Add Aurora PostgreSQL repositories when DB is provisioned
    throw new Error("PostgreSQL repositories not yet implemented");
  }

  instance = createInMemoryRepositories();
  return instance;
}

/** Reset singleton (for testing). */
export function resetRepositories(): void {
  instance = null;
}

export type { Repositories } from "./types";
