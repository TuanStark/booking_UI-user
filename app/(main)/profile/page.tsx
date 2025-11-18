'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import {
  User2,
  Mail,
  Shield,
  MapPin,
  Phone,
  Calendar,
  CheckCircle,
  RefreshCw,
  Settings,
} from 'lucide-react'
import { useRequireAuth } from '@/hooks/useAuth'
import { useUser } from '@/contexts/UserContext'

export default function ProfilePage() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth()
  const { user, refreshUser } = useUser()

  const profileMeta = useMemo(
    () => [
      {
        label: 'Vai trò',
        value: user?.role?.name || 'User',
        icon: Shield,
        accent: 'text-purple-600 dark:text-purple-300',
      },
      {
        label: 'Đã tham gia',
        value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—',
        icon: Calendar,
        accent: 'text-blue-600 dark:text-blue-300',
      },
      {
        label: 'Trạng thái',
        value: 'Đang hoạt động',
        icon: CheckCircle,
        accent: 'text-emerald-600 dark:text-emerald-300',
      },
    ],
    [user],
  )

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-b-2 border-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải thông tin tài khoản...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-6 pt-6 pb-12 space-y-8">
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 md:p-7 relative overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-r from-blue-500 to-purple-600" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <User2 className="h-9 w-9 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
                Hồ sơ người dùng
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                {user.name || user.email}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => refreshUser()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Làm mới
            </button>
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Cài đặt tài khoản
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {profileMeta.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 p-4 flex items-center gap-3"
              >
                <Icon className={`h-10 w-10 ${item.accent}`} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    {item.label}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Thông tin cá nhân
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              <ProfileField label="Họ và tên" value={user.name || '—'} />
              <ProfileField label="Email" value={user.email || '—'} />
              <ProfileField label="Vai trò" value={user.role?.name || '—'} />
              <ProfileField
                label="Ngày tạo tài khoản"
                value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Liên hệ & bảo mật
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              <ProfileField
                label="Số điện thoại"
                value={user.phone || 'Chưa cập nhật'}
                icon={Phone}
              />
              <ProfileField label="Địa chỉ" value={user.address || 'Chưa cập nhật'} icon={MapPin} />
              <ProfileField label="Trạng thái xác minh" value="Đã xác minh" icon={Shield} />
              <ProfileField label="Cập nhật gần nhất" value="—" icon={Calendar} />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Điều hướng nhanh
            </h3>
            <div className="space-y-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{link.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{link.subtitle}</p>
                  </div>
                  <link.icon className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProfileField({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon?: typeof User2
}) {
  return (
    <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60">
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </p>
      <div className="flex items-center gap-2 text-gray-900 dark:text-white">
        {Icon && <Icon className="h-4 w-4 text-gray-400" />}
        <span className="text-base font-medium">{value}</span>
      </div>
    </div>
  )
}

const quickLinks = [
  {
    title: 'Đơn đặt phòng của tôi',
    subtitle: 'Theo dõi trạng thái & lịch sử',
    href: '/bookings',
    icon: Calendar,
  },
  {
    title: 'Thông tin cá nhân',
    subtitle: 'Cập nhật hồ sơ và liên hệ',
    href: '/settings/profile',
    icon: User2,
  },
  {
    title: 'Bảo mật & đăng nhập',
    subtitle: 'Quản lý mật khẩu và phiên hoạt động',
    href: '/settings/security',
    icon: Shield,
  },
]

