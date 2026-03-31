/**
 * Service layer shared types.
 * ServiceResult follows PROJECT_TECH_RULES §5:
 * "境界でエラーをキャッチし、型として返す"
 */

export interface ServiceError {
  code: "NOT_FOUND" | "UNAUTHORIZED" | "CONFLICT" | "VALIDATION" | "FORBIDDEN" | "INTERNAL";
  message: string;
}

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: ServiceError };

export function ok<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

export function fail<T>(code: ServiceError["code"], message: string): ServiceResult<T> {
  return { success: false, error: { code, message } };
}
