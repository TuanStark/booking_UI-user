/**
 * Tìm payload EMAIL_NOT_VERIFIED trong body bọc nhiều lớp (auth-service / Nest / API Gateway).
 */
export function extractEmailNotVerifiedPayload(body: unknown): {
  userId: string;
  email: string;
} | null {
  let found: { userId: string; email: string } | null = null;
  const walk = (o: unknown, depth: number) => {
    if (found || !o || typeof o !== "object" || depth > 14) return;
    const r = o as Record<string, unknown>;
    if (
      r.code === "EMAIL_NOT_VERIFIED" &&
      typeof r.userId === "string" &&
      typeof r.email === "string"
    ) {
      found = { userId: r.userId, email: r.email };
      return;
    }
    for (const v of Object.values(r)) {
      if (v && typeof v === "object") walk(v, depth + 1);
    }
  };
  walk(body, 0);
  return found;
}
