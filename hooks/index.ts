import { useState, useEffect, useCallback } from 'react'
import { Building, Room, FilterState, SearchParams, BookingFormData } from '@/types'
import { MockDataService } from '@/services/mockDataService'

// Custom hook for managing buildings
export function useBuildings() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBuildings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = MockDataService.getAllBuildings()
      setBuildings(data)
    } catch (err) {
      setError('Không thể tải danh sách tòa nhà')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBuildings()
  }, [fetchBuildings])

  const searchBuildings = useCallback((query: string) => {
    return MockDataService.searchBuildings(query)
  }, [])

  const filterBuildings = useCallback((filters: {
    minPrice?: number
    maxPrice?: number
    minRating?: number
    amenities?: string[]
  }) => {
    return MockDataService.filterBuildings(filters)
  }, [])

  const getFeaturedBuildings = useCallback((limit = 4) => {
    return MockDataService.getFeaturedBuildings(limit)
  }, [])

  return {
    buildings,
    loading,
    error,
    fetchBuildings,
    searchBuildings,
    filterBuildings,
    getFeaturedBuildings
  }
}

// Custom hook for managing rooms
export function useRooms(buildingId?: string) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = buildingId 
        ? MockDataService.getRoomsByBuildingId(buildingId)
        : MockDataService.getAllRooms()
      setRooms(data)
    } catch (err) {
      setError('Không thể tải danh sách phòng')
    } finally {
      setLoading(false)
    }
  }, [buildingId])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const filterRooms = useCallback((filters: {
    type?: string
    minPrice?: number
    maxPrice?: number
    available?: boolean
    floor?: number
  }) => {
    return MockDataService.filterRooms({ ...filters, buildingId })
  }, [buildingId])

  const getAvailableRooms = useCallback(() => {
    return rooms.filter(room => room.available)
  }, [rooms])

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    filterRooms,
    getAvailableRooms
  }
}

// Custom hook for managing a single room
export function useRoom(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoom = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = MockDataService.getRoomById(roomId)
      if (data) {
        setRoom(data)
      } else {
        setError('Không tìm thấy phòng')
      }
    } catch (err) {
      setError('Không thể tải thông tin phòng')
    } finally {
      setLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    if (roomId) {
      fetchRoom()
    }
  }, [roomId, fetchRoom])

  const getRelatedRooms = useCallback((limit = 3) => {
    return MockDataService.getRelatedRooms(roomId, limit)
  }, [roomId])

  return {
    room,
    loading,
    error,
    fetchRoom,
    getRelatedRooms
  }
}

// Custom hook for managing a single building
export function useBuilding(buildingId: string) {
  const [building, setBuilding] = useState<Building | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBuilding = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = MockDataService.getBuildingById(buildingId)
      if (data) {
        setBuilding(data)
      } else {
        setError('Không tìm thấy tòa nhà')
      }
    } catch (err) {
      setError('Không thể tải thông tin tòa nhà')
    } finally {
      setLoading(false)
    }
  }, [buildingId])

  useEffect(() => {
    if (buildingId) {
      fetchBuilding()
    }
  }, [buildingId, fetchBuilding])

  const getBuildingStats = useCallback(() => {
    return MockDataService.getBuildingStats(buildingId)
  }, [buildingId])

  return {
    building,
    loading,
    error,
    fetchBuilding,
    getBuildingStats
  }
}

// Custom hook for managing filters
export function useFilters<T>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters)

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const applyFilters = useCallback((newFilters: Partial<T>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  return {
    filters,
    updateFilter,
    resetFilters,
    applyFilters
  }
}

// Custom hook for managing search
export function useSearch(initialParams: SearchParams) {
  const [searchParams, setSearchParams] = useState<SearchParams>(initialParams)

  const updateSearchTerm = useCallback((searchTerm: string) => {
    setSearchParams(prev => ({ ...prev, searchTerm }))
  }, [])

  const updateSortBy = useCallback((sortBy: SearchParams['sortBy']) => {
    setSearchParams(prev => ({ ...prev, sortBy }))
  }, [])

  const updateFilterType = useCallback((filterType: SearchParams['filterType']) => {
    setSearchParams(prev => ({ ...prev, filterType }))
  }, [])

  const updateViewMode = useCallback((viewMode: SearchParams['viewMode']) => {
    setSearchParams(prev => ({ ...prev, viewMode }))
  }, [])

  const resetSearch = useCallback(() => {
    setSearchParams(initialParams)
  }, [initialParams])

  return {
    searchParams,
    updateSearchTerm,
    updateSortBy,
    updateFilterType,
    updateViewMode,
    resetSearch
  }
}

// Custom hook for managing booking
export function useBooking() {
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  const submitBooking = useCallback(async (bookingData: BookingFormData) => {
    try {
      setIsBooking(true)
      setBookingError(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock success response
      return {
        success: true,
        bookingId: `DB${Date.now()}`,
        message: 'Đặt phòng thành công!'
      }
    } catch (error) {
      setBookingError('Có lỗi xảy ra khi đặt phòng')
      return {
        success: false,
        message: 'Có lỗi xảy ra khi đặt phòng'
      }
    } finally {
      setIsBooking(false)
    }
  }, [])

  return {
    isBooking,
    bookingError,
    submitBooking
  }
}

// Custom hook for managing pagination
export function usePagination<T>(items: T[], itemsPerPage = 6) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }, [currentPage, totalPages])

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }, [currentPage])

  const resetPagination = useCallback(() => {
    setCurrentPage(1)
  }, [])

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  }
}

// Custom hook for managing dark mode
export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDarkMode(shouldBeDark)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev)
  }, [])

  return {
    isDarkMode,
    toggleDarkMode
  }
}

// Custom hook for managing scroll position
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsScrolled(currentScrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return {
    scrollY,
    isScrolled
  }
}

// Custom hook for managing local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}
