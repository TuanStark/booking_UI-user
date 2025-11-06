'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Custom hook for managing loading states
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)
  
  const startLoading = () => setIsLoading(true)
  const stopLoading = () => setIsLoading(false)
  
  return { isLoading, startLoading, stopLoading }
}

// Custom hook for managing error states
export function useError() {
  const [error, setError] = useState<string | null>(null)
  
  const setErrorMessage = (message: string) => setError(message)
  const clearError = () => setError(null)
  
  return { error, setErrorMessage, clearError }
}

// Custom hook for form validation
export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) {
  const [formData, setFormData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const validateField = (field: keyof T, value: any) => {
    const rule = validationRules[field]
    if (rule) {
      const error = rule(value)
      setErrors(prev => ({ ...prev, [field]: error || undefined }))
      return !error
    }
    return true
  }

  const validateForm = () => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field as keyof T]
      if (rule) {
        const error = rule(formData[field as keyof T])
        if (error) {
          newErrors[field as keyof T] = error
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const setFieldValue = (field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field, value)
  }

  const setFieldTouched = (field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const resetForm = () => {
    setFormData(initialData)
    setErrors({})
    setTouched({})
  }

  return {
    formData,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0
  }
}

// Custom hook for pagination
export function usePagination<T>(
  items: T[],
  itemsPerPage: number = 10
) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = items.slice(startIndex, endIndex)
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  
  const nextPage = () => goToPage(currentPage + 1)
  const prevPage = () => goToPage(currentPage - 1)
  
  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  }
}

// Custom hook for search and filtering
export function useSearchAndFilter<T>(
  items: T[],
  searchFields: (keyof T)[],
  filterFn?: (item: T, filters: any) => boolean
) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<any>({})
  
  const filteredItems = items.filter(item => {
    // Search filter
    if (searchTerm) {
      const matchesSearch = searchFields.some(field => {
        const value = item[field]
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
      if (!matchesSearch) return false
    }
    
    // Custom filter function
    if (filterFn) {
      return filterFn(item, filters)
    }
    
    return true
  })
  
  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredItems
  }
}

// Custom hook for local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}

// Custom hook for API calls with retry logic
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = async () => {
    setIsLoading(true)
    setError(null)
    
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await apiCall()
        setData(result)
        setIsLoading(false)
        return result
      } catch (err) {
        lastError = err as Error
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt))
        }
      }
    }
    
    setError(lastError?.message || 'An error occurred')
    setIsLoading(false)
    throw lastError
  }

  return { data, isLoading, error, execute }
}

// Custom hook for managing modals
export function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  
  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)
  const toggleModal = () => setIsOpen(prev => !prev)
  
  return { isOpen, openModal, closeModal, toggleModal }
}

// Custom hook for managing tabs
export function useTabs<T>(defaultTab: T) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab)
  
  const switchTab = (tab: T) => setActiveTab(tab)
  
  return { activeTab, switchTab }
}

// Custom hook for managing view modes
export function useViewMode(defaultMode: 'grid' | 'list' = 'grid') {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultMode)
  
  const toggleViewMode = () => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')
  const setGridView = () => setViewMode('grid')
  const setListView = () => setViewMode('list')
  
  return { viewMode, toggleViewMode, setGridView, setListView }
}

// Custom hook for managing selections
export function useSelection<T>(multiple: boolean = false) {
  const [selectedItems, setSelectedItems] = useState<T[]>([])
  
  const selectItem = (item: T) => {
    if (multiple) {
      setSelectedItems(prev => 
        prev.includes(item) 
          ? prev.filter(i => i !== item)
          : [...prev, item]
      )
    } else {
      setSelectedItems([item])
    }
  }
  
  const clearSelection = () => setSelectedItems([])
  const isSelected = (item: T) => selectedItems.includes(item)
  
  return { selectedItems, selectItem, clearSelection, isSelected }
}

// Custom hook for managing sorting
export function useSorting<T>(
  items: T[],
  defaultSortBy?: keyof T,
  defaultSortOrder: 'asc' | 'desc' = 'asc'
) {
  const [sortBy, setSortBy] = useState<keyof T | undefined>(defaultSortBy)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder)
  
  const sortedItems = [...items].sort((a, b) => {
    if (!sortBy) return 0
    
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })
  
  const handleSort = (field: keyof T) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }
  
  return { sortedItems, sortBy, sortOrder, handleSort }
}

// Custom hook for managing URL parameters
export function useUrlParams() {
  const router = useRouter()
  
  const updateParams = (params: Record<string, string | number | boolean>) => {
    const url = new URL(window.location.href)
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        url.searchParams.delete(key)
      } else {
        url.searchParams.set(key, String(value))
      }
    })
    
    router.push(url.pathname + url.search)
  }
  
  const getParam = (key: string) => {
    const url = new URL(window.location.href)
    return url.searchParams.get(key)
  }
  
  return { updateParams, getParam }
}
