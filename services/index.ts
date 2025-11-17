/**
 * Services - Centralized Exports
 * 
 * Enterprise pattern: Barrel Export Pattern
 * Provides a single entry point for all services
 * 
 * @example
 * ```typescript
 * import { BuildingService, RoomService, BookingService } from '@/services'
 * ```
 */

// Core Services
export { BuildingService } from './buildingService'
export { RoomService } from './roomService'
export { BookingService } from './bookingService'
export { ReviewService } from './reviewService'

// API Client
export { apiClient, default as ApiClient } from './apiClient'

// Mappers (for advanced usage)
export * from './mappers/buildingMapper'
export * from './mappers/roomMapper'

// Legacy exports (for backward compatibility)
export { BookingService as BookingServiceLegacy, ReviewService as ReviewServiceLegacy } from './backendService'

