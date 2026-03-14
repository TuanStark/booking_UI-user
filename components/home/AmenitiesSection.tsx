"use client";

import { MapPin, Wifi, Car, Utensils, Shield, Clock } from "lucide-react";

interface Amenity {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  color: string;
}

const amenities: Amenity[] = [
  { icon: Wifi, name: "WiFi Miễn Phí", color: "bg-[#4b5cb1]" },
  { icon: Car, name: "Bãi Đỗ Xe", color: "bg-green-500" },
  { icon: Utensils, name: "Căng Tin", color: "bg-orange-500" },
  { icon: Shield, name: "Bảo Vệ 24/7", color: "bg-red-500" },
  { icon: Clock, name: "Giờ Giấc Linh Hoạt", color: "bg-purple-500" },
  { icon: MapPin, name: "Gần Trường", color: "bg-yellow-500" },
];

export default function AmenitiesSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tiện Nghi Đầy Đủ
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tất cả các ký túc xá đều được trang bị đầy đủ tiện nghi hiện đại
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {amenities.map((amenity, index) => {
            const IconComponent = amenity.icon;
            return (
              <div key={index} className="text-center group">
                <div
                  className={`w-16 h-16 ${amenity.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {amenity.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
