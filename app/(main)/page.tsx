import {
  HeroSection,
  FeaturedDormsSection,
  TestimonialsSection,
  NewsSection,
  CTASection,
  PartnersSection
} from '@/components/home'

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
