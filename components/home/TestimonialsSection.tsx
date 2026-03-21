"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import apiClient from "@/services/apiClient";
import {
  extractPublicReviewsPayload,
  mapApiReviewToHomeTestimonial,
  mergeTestimonialsWithFallback,
  type HomeTestimonial,
} from "@/lib/homeTestimonials";
import { TESTIMONIALS_FALLBACK } from "@/constants/testimonialsFallback";
import { cn } from "@/lib/utils";

const MIN_TESTIMONIALS = 2;
const MAX_TESTIMONIALS = 4;
const FETCH_LIMIT = 16;

export default function TestimonialsSection() {
  const [items, setItems] = useState<HomeTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let fromApi: HomeTestimonial[] = [];
      try {
        const raw = await apiClient.getPublicReviews({
          page: 1,
          limit: FETCH_LIMIT,
        });
        if (cancelled) return;
        const rows = extractPublicReviewsPayload(raw);
        fromApi = rows
          .map(mapApiReviewToHomeTestimonial)
          .filter((x): x is HomeTestimonial => x != null);
      } catch {
        if (!cancelled) fromApi = [];
      }

      if (cancelled) return;

      const merged = mergeTestimonialsWithFallback(
        fromApi,
        MIN_TESTIMONIALS,
        MAX_TESTIMONIALS,
      );
      setItems(merged);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const skeletonKeys = TESTIMONIALS_FALLBACK.map((m) => m.id);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Đánh Giá Từ Sinh Viên
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Một phần lời chia sẻ từ người đã đặt phòng qua nền tảng (kèm ví dụ minh
            họa khi còn ít đánh giá).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {loading
            ? skeletonKeys.map((key) => (
                <div
                  key={key}
                  className="bg-gray-50 p-8 rounded-2xl border border-gray-100 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-6" />
                  <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-5/6 mb-8" />
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                      <div className="h-2 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))
            : items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300",
                    item.fromApi === false && "ring-1 ring-amber-100/80",
                  )}
                >
                  <div className="text-blue-500 text-6xl font-serif mb-4 leading-none">
                    &ldquo;
                  </div>
                  {item.rating != null && item.rating > 0 && (
                    <div
                      className="flex items-center gap-0.5 mb-4"
                      aria-label={`${item.rating} trên 5 sao`}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.round(item.rating!)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200 dark:text-gray-600",
                          )}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {item.content}
                  </p>
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-100">
                      <Image
                        src={item.avatar}
                        alt={item.author}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.author}</h4>
                      <p className="text-sm text-gray-500">{item.role}</p>
                      {/* {item.fromApi === false && (
                        <p className="text-xs text-amber-700/90 mt-1">
                          Ví dụ minh họa
                        </p>
                      )} */}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
