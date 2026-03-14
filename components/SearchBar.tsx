"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/utils/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  onSearch?: (search: string, city: string) => void;
  className?: string;
}

const cities = ["Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng"];

function SearchBarContent({ onSearch, className }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [location, setLocation] = useState(searchParams.get("city") || "");
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Đồng bộ URL với State
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setLocation(searchParams.get("city") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Gọi callback (nếu có component cha muốn dùng)
    onSearch?.(searchQuery, location);

    // Xử lý tạo URL parameters
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }

    if (location.trim()) {
      params.set("city", location.trim());
    } else {
      params.delete("city");
    }

    // Tự động điều hướng đến trang /buildings kèm bộ lọc
    router.push(`/buildings?${params.toString()}`);
  };

  const handleSelect = (city: string) => {
    setLocation(city);
    setOpen(false);
  };

  // close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm ký túc xá..."
            className="w-full pl-10 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 transition-colors"
          />
        </div>

        {/* Location + buttons */}
        <div className="flex gap-4">
          {/* City selector */}
          <div className="relative flex-1" ref={wrapperRef}>
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />

            <input
              value={location}
              onFocus={() => setOpen(true)}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Thành phố..."
              className="w-full pl-10 pr-4 py-3 border rounded-xl dark:bg-gray-800 text-black dark:text-gray-100 transition-colors"
            />

            {open && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-lg list-none overflow-hidden animate-in fade-in zoom-in-95">
                {cities.map((city) => (
                  <div
                    key={city}
                    onClick={() => handleSelect(city)}
                    className="px-4 py-3 hover:bg-blue-50 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-brand hover:bg-brand-dark text-white px-6 rounded-xl font-medium transition-all active:scale-95 shadow-md"
          >
            Tìm kiếm
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            "w-full max-w-4xl mx-auto space-y-4 animate-pulse",
            props.className,
          )}
        >
          <div className="w-full h-[58px] border rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="flex gap-4">
            <div className="flex-1 h-[50px] border rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="w-[100px] h-[50px] rounded-xl bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      }
    >
      <SearchBarContent {...props} />
    </Suspense>
  );
}
