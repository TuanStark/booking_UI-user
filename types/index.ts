// Core domain types
export interface Building {
  id: string
  name: string
  address: string
  images: string | null
  totalRooms: number
  availableRooms: number
  averagePrice: number
  rating: number
  totalReviews: number
  description: string
  amenities: string[]
  latitude: number
  longitude: number
  contact?: ContactInfo
  rules?: string[]
}

export interface BuildingReference {
  id?: string
  name?: string
  address?: string
  images?: string | null
  description?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
  longtitude?: number | string | null
  roomsCount?: number | null
}

export interface Room {
  id: string
  roomNumber: string
  buildingId: string
  buildingName: string
  buildingAddress: string
  type: RoomType
  price: number
  size: string
  capacity: string
  beds: string
  bathrooms: string
  available: boolean
  images: string[]
  description: string
  features: RoomFeature[]
  amenities: string[]
  floor: number
  window: string
  rating: number
  reviews: number
  contact: ContactInfo
  rules: string[]
  nearbyFacilities: NearbyFacility[]
  buildingInfo?: BuildingReference
}

export interface ContactInfo {
  phone: string
  email: string
  manager: string
}

export interface RoomFeature {
  name: string
  icon: any // Lucide icon component
  available: boolean
}

export interface NearbyFacility {
  name: string
  distance: string
  icon: any // Lucide icon component
}

// Enums
export type RoomType = 'Phòng đơn' | 'Phòng đôi' | 'Phòng nhóm'
export type Gender = 'nam' | 'nu' | 'khac' | ''
export type SortOption = 'name' | 'price' | 'rating' | 'availability' | 'roomNumber' | 'floor'
export type ViewMode = 'grid' | 'list'
export type FilterType = 'all' | 'available' | 'đơn' | 'đôi' | 'nhóm'

// Filter and search types
export interface FilterState {
  building: string
  gender: Gender
  roomType: string
  priceRange: [number, number]
}

export interface SearchParams {
  searchTerm: string
  sortBy: SortOption
  filterType: FilterType
  viewMode: ViewMode
}

// Booking types
export interface BookingFormData {
  // Personal Info
  fullName: string
  email: string
  phone: string
  studentId: string

  // Booking Details
  moveInDate: string
  moveOutDate: string
  duration: number

  // Payment
  paymentMethod: 'VIETQR' | 'VNPAY'

  // Additional Info
  specialRequests: string
  emergencyContact: string
  emergencyPhone: string

  // Terms
  agreeToTerms: boolean
  agreeToPrivacy: boolean
}

export interface BookingRequest {
  roomId: string
  buildingId: string
  formData: BookingFormData
}

export interface BookingResponse {
  success: boolean
  bookingId?: string
  message: string
}

// UI Component Props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface CardProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  imageUrl?: string
  onClick?: () => void
  isSelected?: boolean
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
}

// Theme types
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
  }
  fonts: {
    primary: string
    secondary: string
  }
  breakpoints: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

// Navigation types
export interface NavItem {
  name: string
  href: string
  icon?: any
  children?: NavItem[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface FormState {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
}