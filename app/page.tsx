'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  HeroSection,
  FeaturedDormsSection,
  FeaturesSection,
  AmenitiesSection,
  CTASection
} from '@/components/home'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <HeroSection />
      <FeaturedDormsSection limit={4} />
      <FeaturesSection />
      <AmenitiesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
