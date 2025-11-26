'use client'

import Link from 'next/link'
import { Building2, Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                DormBooking
              </span>
            </Link>
            <p className="text-gray-500 mb-6 max-w-sm leading-relaxed">
              Nền tảng đặt phòng ký túc xá hàng đầu, kết nối sinh viên với những không gian sống tiện nghi và an toàn nhất.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Về Chúng Tôi</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-500 hover:text-blue-600 transition-colors">Giới thiệu</Link></li>
              <li><Link href="/careers" className="text-gray-500 hover:text-blue-600 transition-colors">Tuyển dụng</Link></li>
              <li><Link href="/news" className="text-gray-500 hover:text-blue-600 transition-colors">Tin tức</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-blue-600 transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">Dịch Vụ</h3>
            <ul className="space-y-4">
              <li><Link href="/buildings" className="text-gray-500 hover:text-blue-600 transition-colors">Tìm phòng</Link></li>
              <li><Link href="/partner" className="text-gray-500 hover:text-blue-600 transition-colors">Đăng tin</Link></li>
              <li><Link href="/pricing" className="text-gray-500 hover:text-blue-600 transition-colors">Bảng giá</Link></li>
              <li><Link href="/support" className="text-gray-500 hover:text-blue-600 transition-colors">Hỗ trợ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">Liên Hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-500">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                <span>123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-500">
                <Phone className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <span>(028) 1234 5678</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-500">
                <Mail className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <span>contact@dormbooking.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2024 DormBooking. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-blue-600 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
