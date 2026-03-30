/**
 * Application configuration types.
 * Controls persistence provider selection and connection details.
 */

export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
}

export interface AppConfig {
  provider: "in-memory" | "postgres";
  database?: DatabaseConfig;
}
