'use client'

import {
  HeroSection,
  FeaturedDormsSection,
  FeaturesSection,
  AmenitiesSection,
  CTASection
} from '@/components/home'

export default function Home() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <FeaturedDormsSection limit={4} />
      <FeaturesSection />
      <AmenitiesSection />
      <CTASection />
    </div>
  )
}
