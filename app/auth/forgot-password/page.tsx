"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Quên mật khẩu?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Tính năng này đang được phát triển. Vui lòng liên hệ quản trị viên để được hỗ trợ.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
