/**
 * Centralized Axios Instance
 * 
 * This is a reusable axios instance configured for the entire application.
 * Use this instead of creating new axios instances in each service.
 * 
 * Features:
 * - Base URL configuration
 * - Default headers (Content-Type: application/json)
 * - Request/Response interceptors
 * - Error handling
 * - TypeScript support
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { NetworkError, ServerError, ValidationError } from '@/lib/errors'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
      const errorData = (error.response.data as any) || {}

      if (status >= 400 && status < 500) {
        if (status === 404) {
          throw new ValidationError(errorData.message || 'Resource not found')
        }
        throw new ValidationError(errorData.message || `Client error: ${status}`)
      }

      if (status >= 500) {
        throw new ServerError(
          errorData.message || `Server error: ${status}`,
          status
        )
      }

      throw new ServerError(errorData.message || `HTTP error: ${status}`, status)
    } else if (error.request) {
      throw new NetworkError('Network request failed. Please check your connection.')
    } else {
      throw new NetworkError(error.message || 'An unexpected error occurred')
    }
  }
)

export async function apiRequest<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await axiosInstance.request<T>({
      url: endpoint,
      ...config,
    })
    return response.data
  } catch (error: any) {
    if (error instanceof NetworkError || error instanceof ServerError || error instanceof ValidationError) {
      throw error
    }
    throw new NetworkError(error.message || 'An unexpected error occurred')
  }
}

export const api = {
  get: <T>(endpoint: string, config?: AxiosRequestConfig) =>
    apiRequest<T>(endpoint, { ...config, method: 'GET' }),
  
  post: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>(endpoint, { ...config, method: 'POST', data }),
  
  put: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>(endpoint, { ...config, method: 'PUT', data }),
  
  patch: <T>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>(endpoint, { ...config, method: 'PATCH', data }),
  
  delete: <T>(endpoint: string, config?: AxiosRequestConfig) =>
    apiRequest<T>(endpoint, { ...config, method: 'DELETE' }),
}

export default axiosInstance

