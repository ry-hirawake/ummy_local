/**
 * Config factory.
 * Returns AppConfig based on environment variables.
 * Dev/test defaults to in-memory; production uses postgres.
 */

import type { AppConfig } from "./types";

let cachedConfig: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (cachedConfig) return cachedConfig;

  const provider = process.env.DB_PROVIDER === "postgres" ? "postgres" : "in-memory";

  if (provider === "postgres") {
    cachedConfig = {
      provider: "postgres",
      database: {
        host: process.env.DB_HOST ?? "localhost",
        port: parseInt(process.env.DB_PORT ?? "5432", 10),
        name: process.env.DB_NAME ?? "ummy",
        user: process.env.DB_USER ?? "ummy",
        password: process.env.DB_PASSWORD ?? "",
      },
    };
  } else {
    cachedConfig = { provider: "in-memory" };
  }

  return cachedConfig;
}

/** Reset cached config (for testing). */
export function resetConfig(): void {
  cachedConfig = null;
}

export type { AppConfig } from "./types";
