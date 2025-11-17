import { NavItem, SortOption, FilterType, RoomType, Gender } from '@/types'

// Navigation items
export const NAV_ITEMS: NavItem[] = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Tòa nhà', href: '/buildings' },
  { name: 'Giới thiệu', href: '/about' },
  { name: 'Liên hệ', href: '/contact' },
]

// Sort options
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'name', label: 'Tên tòa nhà' },
  { value: 'price', label: 'Giá trung bình' },
  { value: 'rating', label: 'Đánh giá' },
  { value: 'availability', label: 'Số phòng trống' },
]

export const ROOM_SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'roomNumber', label: 'Số phòng' },
  { value: 'price', label: 'Giá' },
  { value: 'rating', label: 'Đánh giá' },
  { value: 'floor', label: 'Tầng' },
]

// Filter options
export const FILTER_TYPES: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'available', label: 'Còn trống' },
  { value: 'đơn', label: 'Phòng đơn' },
  { value: 'đôi', label: 'Phòng đôi' },
  { value: 'nhóm', label: 'Phòng nhóm' },
]

// Room types
export const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: 'Phòng đơn', label: 'Đơn' },
  { value: 'Phòng đôi', label: 'Đôi' },
  { value: 'Phòng nhóm', label: 'Nhóm' },
]

// Gender options
export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'nam', label: 'Nam' },
  { value: 'nu', label: 'Nữ' },
  { value: 'khac', label: 'Khác' },
  { value: '', label: 'Tất cả' },
]

// Building names
export const BUILDING_NAMES = [
  'Tòa A - Maple Hall',
  'Tòa B - Cedar Hall', 
  'Tòa C - Oak Residence',
  'Tòa D - Pine House',
  'Tòa E - Elm Building',
  'Tòa F - Willow Hall'
]

// Common amenities
export const COMMON_AMENITIES = [
  'WiFi',
  'Parking',
  'Dining',
  'Security',
  'Laundry',
  'Study Room',
  'Gym',
  'Library'
]

// Room features
export const ROOM_FEATURES = [
  'Giường đơn',
  'Giường đôi',
  'Giường tầng',
  'Bàn học',
  'Tủ quần áo',
  'WC riêng',
  'WC chung',
  'Máy lạnh',
  'WiFi',
  'Tủ lạnh',
  'TV',
  'Ban công'
]

// Form validation
export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email không hợp lệ'
  },
  phone: {
    pattern: /^[0-9]{10,11}$/,
    message: 'Số điện thoại phải có 10-11 chữ số'
  },
  studentId: {
    pattern: /^[A-Z0-9]{6,10}$/,
    message: 'Mã sinh viên phải có 6-10 ký tự'
  },
  required: {
    message: 'Trường này là bắt buộc'
  }
}

// API endpoints
export const API_ENDPOINTS = {
  BUILDINGS: '/buildings',
  ROOMS: '/rooms',
  BOOKINGS: '/bookings',
  AUTH: '/auth',
  UPLOAD: '/api/upload'
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 6,
  MAX_PAGE_SIZE: 50,
  PAGE_SIZE_OPTIONS: [6, 12, 24, 48]
}

// Price ranges
export const PRICE_RANGES = {
  MIN: 0,
  MAX: 2000,
  STEP: 50,
  DEFAULT: [0, 2000]
}

// Image settings
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  THUMBNAIL_SIZE: 80,
  GALLERY_SIZE: 400
}

// Booking steps
export const BOOKING_STEPS = [
  { step: 1, label: 'Thông tin cá nhân', icon: 'user' },
  { step: 2, label: 'Xác nhận', icon: 'check' },
  { step: 3, label: 'Hoàn thành', icon: 'success' }
]

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  UNAUTHORIZED: 'Bạn cần đăng nhập để thực hiện hành động này.',
  FORBIDDEN: 'Bạn không có quyền thực hiện hành động này.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
  BOOKING_ERROR: 'Có lỗi xảy ra khi đặt phòng.',
  UPLOAD_ERROR: 'Có lỗi xảy ra khi tải lên hình ảnh.'
}

// Success messages
export const SUCCESS_MESSAGES = {
  BOOKING_SUCCESS: 'Đặt phòng thành công!',
  UPDATE_SUCCESS: 'Cập nhật thành công!',
  DELETE_SUCCESS: 'Xóa thành công!',
  UPLOAD_SUCCESS: 'Tải lên thành công!'
}

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
}

// Theme colors
export const THEME_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#8B5CF6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4'
}

// Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
}

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
}

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070
}
