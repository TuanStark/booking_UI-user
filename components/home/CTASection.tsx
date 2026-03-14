"use client";

import Link from "next/link";
import Image from "next/image";

export default function CTASection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 relative h-64 md:h-96 w-full">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students working together"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brand-dark/60 md:bg-transparent" />
            </div>

            <div className="md:w-1/2 p-8 md:p-12 text-white text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Liên hệ với chúng tôi
              </h2>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Bạn có bất kỳ câu hỏi hoặc cần hỗ trợ? Hãy liên hệ với chúng tôi
                qua các kênh dưới đây.
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-4 bg-white text-brand rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
