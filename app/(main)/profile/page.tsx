'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
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
  ArrowRight,
  ShieldCheck,
  Fingerprint,
  Info,
  LogOut,
  Edit3,
  X,
  Save,
  Loader2,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRequireAuth } from '@/hooks/useAuth'
import { useUser } from '@/contexts/UserContext'
import { cn } from '@/utils/utils'
import { updateProfile } from '@/services/apiClient'
import { useToast } from '@/hooks/use-toast'

export default function ProfilePage() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth()
  const { user, refreshUser, accessToken } = useUser()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  })

  // Sync form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      })
    }
  }, [user])

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data if canceling
      setFormData({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
      })
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async () => {
    if (!user?.id || !accessToken) return

    setIsUpdating(true)
    try {
      await updateProfile(user.id, formData, accessToken)
      await refreshUser()
      toast({
        title: 'Thành công',
        description: 'Thông tin cá nhân đã được cập nhật.',
      })
      setIsEditing(false)
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật thông tin.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const profileStats = useMemo(
    () => [
      {
        label: 'Vai trò',
        value: user?.role?.name || 'User',
        icon: Shield,
        color: 'purple',
      },
      {
        label: 'Thành viên từ',
        value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }) : '—',
        icon: Calendar,
        color: 'blue',
      },
      {
        label: 'Trạng thái',
        value: 'Xác minh',
        icon: ShieldCheck,
        color: 'emerald',
      },
    ],
    [user],
  )

  const QUICK_LINKS = [
    {
      title: 'Đặt phòng của tôi',
      subtitle: 'Theo dõi trạng thái & lịch sử',
      href: '/bookings',
      icon: Calendar,
    },
    {
      title: 'Hồ sơ cá nhân',
      subtitle: 'Cập nhật ảnh & thông tin',
      href: '/profile',
      icon: User2,
    }
  ]

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
          <User2 className="h-8 w-8 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) return null

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] pb-16">
      {/* Premium Header Profile Section */}
      <div className="relative bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 pt-12 pb-20 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-400/10 rounded-full blur-3xl -ml-36 -mb-36"></div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 flex items-center justify-center shadow-xl">
                  <div className="w-full h-full rounded-[1.4rem] bg-white dark:bg-[#1E293B] flex items-center justify-center overflow-hidden">
                    <User2 className="h-14 w-14 md:h-16 md:w-16 text-indigo-500" />
                  </div>
                </div>
                <div className="absolute bottom-1.5 right-1.5 h-8 w-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center border-4 border-[#F8FAFC] dark:border-[#0F172A]">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[0.65rem] font-black uppercase tracking-widest">
                  <Fingerprint className="h-3 w-3" />
                  Verified Student
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {user.name || 'User Profile'}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 text-slate-500 dark:text-slate-400 font-bold text-sm">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-indigo-500" />
                    {user.email}
                  </div>
                  {user.phone && (
                    <>
                      <div className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4 text-indigo-500" />
                        {user.phone}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => refreshUser()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
              >
                <RefreshCw className="h-4 w-4" />
                Làm mới
              </button>
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-black text-sm shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Settings className="h-4 w-4" />
                Cài đặt
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-10 relative z-20">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {profileStats.map((stat, idx) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-[#1E293B] p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/40 dark:shadow-none flex items-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center transition-transform duration-500",
                stat.color === 'purple' && "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
                stat.color === 'blue' && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                stat.color === 'emerald' && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
              )}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{stat.label}</p>
                <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Info Columns */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-[#1D283A] rounded-[1.8rem] border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-lg shadow-slate-200/20 dark:shadow-none animate-in fade-in duration-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-1 rounded-full bg-indigo-600"></div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Chi tiết hồ sơ</h2>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleEditToggle}
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                        Hủy
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        Lưu thay đổi
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-200 transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <ProfileFieldCard
                  label="Họ và tên"
                  value={user.name || '—'}
                  icon={User2}
                  isEditing={isEditing}
                  name="name"
                  inputValue={formData.name}
                  onChange={handleInputChange}
                />
                <ProfileFieldCard
                  label="Địa chỉ Email"
                  value={user.email}
                  icon={Mail}
                  disabled={true}
                />
                <ProfileFieldCard
                  label="Số điện thoại"
                  value={user.phone || 'Chưa cập nhật'}
                  icon={Phone}
                  isEditing={isEditing}
                  name="phone"
                  inputValue={formData.phone}
                  onChange={handleInputChange}
                />
                <ProfileFieldCard
                  label="Địa chỉ hiện tại"
                  value={user.address || 'Chưa cập nhật'}
                  icon={MapPin}
                  isEditing={isEditing}
                  name="address"
                  inputValue={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Quick Links */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 dark:bg-[#1E293B] rounded-[1.8rem] p-6 text-white shadow-xl shadow-indigo-900/10 animate-in slide-in-from-right-6 duration-700">
              <h3 className="text-lg font-black mb-5 tracking-tight flex items-center gap-2">
                <Info className="h-4 w-4 text-indigo-400" />
                Truy cập nhanh
              </h3>

              <div className="space-y-3">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                        <link.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-black text-xs uppercase tracking-wider">{link.title}</p>
                        <p className="text-[0.65rem] text-slate-400 group-hover:text-slate-300 transition-colors">{link.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => handleLogout()}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-black text-sm transition-all duration-300 border border-rose-500/20"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ProfileFieldCardProps {
  label: string
  value: string
  icon: any
  isEditing?: boolean
  disabled?: boolean
  name?: string
  inputValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function ProfileFieldCard({
  label,
  value,
  icon: Icon,
  isEditing,
  disabled,
  name,
  inputValue,
  onChange
}: ProfileFieldCardProps) {
  return (
    <div className={cn(
      "p-5 rounded-2xl bg-slate-50 dark:bg-[#243146] border border-slate-100 dark:border-slate-800 group transition-all duration-300",
      isEditing && !disabled && "ring-2 ring-indigo-500/20 bg-white"
    )}>
      <div className="flex items-center gap-2.5 mb-2.5">
        <Icon className="h-4 w-4 text-indigo-500" />
        <p className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">{label}</p>
      </div>

      {isEditing && !disabled ? (
        <input
          type="text"
          name={name}
          value={inputValue}
          onChange={onChange}
          className="w-full bg-transparent border-none p-0 text-base font-black text-slate-900 dark:text-white tracking-tight focus:ring-0 placeholder:text-slate-300"
          placeholder={`Nhập ${label.toLowerCase()}...`}
          autoFocus={name === 'name'}
        />
      ) : (
        <p className={cn(
          "text-base font-black tracking-tight",
          disabled ? "text-slate-400" : "text-slate-900 dark:text-white"
        )}>
          {value}
        </p>
      )}
    </div>
  )
}
