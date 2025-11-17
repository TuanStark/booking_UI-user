'use client'

import Image from 'next/image'

interface BuildingImageCarouselProps {
  images: string[]
  buildingName: string
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'

export default function BuildingImageCarousel({ images, buildingName }: BuildingImageCarouselProps) {
  const primaryImage = images?.[0] || FALLBACK_IMAGE

  return (
    <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden rounded-3xl">
      <Image
        src={primaryImage}
        alt={`${buildingName}`}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-4 left-4 text-white">
        <p className="text-xs uppercase tracking-wide text-white/70">Hình ảnh thực tế</p>
        <p className="text-lg font-semibold">{buildingName}</p>
      </div>
    </div>
  )
}

