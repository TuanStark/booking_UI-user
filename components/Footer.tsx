"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white pt-12 pb-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10">

          {/* Brand - Cột trái */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src="/logoDorm.png"
                  alt="KTX Online"
                  width={40}
                  height={40}
                />
              </div>
              <span className="text-2xl font-bold text-gray-900">KTX Online</span>
            </Link>

            <p className="text-gray-600 leading-relaxed max-w-md">
              Nền tảng đặt phòng ký túc xá hàng đầu, kết nối sinh viên với những không gian sống tiện nghi và an toàn nhất.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-8">
              <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-pink-50 text-gray-500 hover:text-pink-600 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-blue-50 text-gray-500 hover:text-blue-400 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-blue-50 text-gray-500 hover:text-blue-700 rounded-full flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">

            {/* Về Chúng Tôi */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-5">Về Chúng Tôi</h3>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/about" className="hover:text-blue-600 transition-colors">Giới thiệu</Link></li>
                <li><Link href="/careers" className="hover:text-blue-600 transition-colors">Tuyển dụng</Link></li>
                <li><Link href="/news" className="hover:text-blue-600 transition-colors">Tin tức</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Liên hệ</Link></li>
              </ul>
            </div>

            {/* Dịch Vụ */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-5">Dịch Vụ</h3>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/buildings" className="hover:text-blue-600 transition-colors">Tìm phòng</Link></li>
                <li><Link href="/partner" className="hover:text-blue-600 transition-colors">Đăng tin</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-600 transition-colors">Bảng giá</Link></li>
                <li><Link href="/support" className="hover:text-blue-600 transition-colors">Hỗ trợ</Link></li>
              </ul>
            </div>

            {/* Liên Hệ */}
            <div className="md:col-span-1 col-span-2">
              <h3 className="font-semibold text-gray-900 mb-5">Liên Hệ</h3>
              <ul className="space-y-4 text-gray-600 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>03 Quang Trung, Hải Châu, Đà Nẵng</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <a href="tel:0845663357" className="hover:text-blue-600">0845 663 357</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <a href="mailto:support@gmail.com" className="hover:text-blue-600">support@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© 2026 KTX Online. All rights reserved.</p>
            <div className="flex gap-6 text-xs sm:text-sm">
              <Link href="/privacy" className="hover:text-gray-700">Chính sách bảo mật</Link>
              <Link href="/terms" className="hover:text-gray-700">Điều khoản dịch vụ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}