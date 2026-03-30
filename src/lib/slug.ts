/**
 * Slug normalization utility.
 * Converts a display name into a URL-safe slug.
 * Japanese characters are preserved as-is.
 */

export function toSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[\s!@#$%^&*()+=\[\]{};:'",.<>?/\\|`~]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}
