import {
  HeroSection,
  FeaturedDormsSection,
  TestimonialsSection,
  NewsSection,
  CTASection,
  PartnersSection
} from '@/components/home'

/** Không prerender tĩnh lúc `next build` (API thường tắt) — tránh FeaturedDormsSection gọi API fail và ẩn cả block. `/buildings` vốn dynamic nhờ searchParams. */
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="space-y-0">
      <div className="relative mb-24">
        <HeroSection />
        <PartnersSection />
      </div>
      <FeaturedDormsSection limit={6} />
      <TestimonialsSection />
      <NewsSection />
      <CTASection />
    </div>
  )
}
