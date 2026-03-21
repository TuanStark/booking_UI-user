import {
  TESTIMONIALS_FALLBACK,
  type FallbackTestimonial,
} from '@/constants/testimonialsFallback'

export type HomeTestimonial = FallbackTestimonial & {
  rating?: number
  fromApi?: boolean
}

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'

/** Bóc tách mảng review từ body gateway/review-service (ResponseData). */
export function extractPublicReviewsPayload(body: unknown): unknown[] {
  if (body == null || typeof body !== 'object') return []
  const root = body as Record<string, unknown>
  const layer = root.data
  if (layer != null && typeof layer === 'object' && !Array.isArray(layer)) {
    const inner = (layer as Record<string, unknown>).data
    if (Array.isArray(inner)) return inner
  }
  if (Array.isArray(layer)) return layer
  return []
}

export function mapApiReviewToHomeTestimonial(raw: unknown): HomeTestimonial | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const id = typeof r.id === 'string' ? r.id : null
  if (!id) return null

  const user =
    r.user && typeof r.user === 'object'
      ? (r.user as Record<string, unknown>)
      : null
  const name =
    typeof user?.name === 'string' && user.name.trim()
      ? user.name.trim()
      : 'Sinh viên'
  const avatar =
    typeof user?.avatar === 'string' && user.avatar.trim()
      ? user.avatar.trim()
      : DEFAULT_AVATAR

  const comment =
    typeof r.comment === 'string' && r.comment.trim()
      ? r.comment.trim()
      : ''
  const rating = Number(r.ratingOverall)
  const hasRating = Number.isFinite(rating) && rating > 0

  const content = comment
    ? comment
    : hasRating
      ? `Đánh giá trải nghiệm đặt phòng: ${rating}/5 sao.`
      : ''

  if (!content) return null

  return {
    id: `api-${id}`,
    content,
    author: name,
    role: 'Sinh viên đã đặt phòng',
    avatar,
    rating: hasRating ? rating : undefined,
    fromApi: true,
  }
}

function dedupeById(items: HomeTestimonial[]): HomeTestimonial[] {
  const seen = new Set<string>()
  const out: HomeTestimonial[] = []
  for (const it of items) {
    if (seen.has(it.id)) continue
    seen.add(it.id)
    out.push(it)
  }
  return out
}

/**
 * Giữ tối đa `max` đánh giá từ API (thứ tự như backend).
 * Nếu ít hơn `min`, nối thêm bản ghi từ `TESTIMONIALS_FALLBACK`.
 */
export function mergeTestimonialsWithFallback(
  fromApi: HomeTestimonial[],
  min = 2,
  max = 4,
): HomeTestimonial[] {
  const capped = dedupeById(fromApi).slice(0, max)
  if (capped.length >= min) return capped
  const need = min - capped.length
  const filler: HomeTestimonial[] = TESTIMONIALS_FALLBACK.slice(0, need).map(
    (m) => ({
      ...m,
      fromApi: false,
    }),
  )
  return [...capped, ...filler]
}
