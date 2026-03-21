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
import { NetworkError, ServerError, ValidationError, EmailNotVerifiedError } from '@/lib/errors'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

/**
 * Normalize gateway / Nest error bodies:
 * - Gateway AllExceptionsFilter: { status, error: string | { message } }
 * - Review/auth: { statusCode, message }
 */
function parseApiErrorMessage(payload: unknown, status: number, fallback: string): string {
  if (payload == null || typeof payload !== 'object') {
    return typeof payload === 'string' && payload.trim() ? payload : fallback
  }
  const p = payload as Record<string, unknown>

  const fromMessage = (m: unknown): string | null => {
    if (typeof m === 'string' && m.trim()) return m
    if (Array.isArray(m)) {
      const parts = m.filter((x) => typeof x === 'string') as string[]
      if (parts.length) return parts.join(', ')
    }
    return null
  }

  const top = fromMessage(p.message)
  if (top) return top

  const err = p.error
  if (typeof err === 'string' && err.trim()) return err
  if (err && typeof err === 'object') {
    const nested = fromMessage((err as Record<string, unknown>).message)
    if (nested) return nested
  }

  return fallback
}

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
    const body = response.data as any;
    if (body && typeof body === 'object' && body.statusCode >= 400) {
      const status = body.statusCode;
      const errorData = body;
      const data = errorData?.data ?? errorData;

      if (status === 403 && data?.code === 'EMAIL_NOT_VERIFIED' && data?.userId && data?.email) {
        return Promise.reject(new EmailNotVerifiedError(data.userId, data.email));
      }

      if (status === 404) {
        return Promise.reject(
          new ValidationError(
            parseApiErrorMessage(errorData, status, 'Resource not found'),
          ),
        )
      }

      if (status >= 400 && status < 500) {
        return Promise.reject(
          new ValidationError(
            parseApiErrorMessage(errorData, status, `Client error: ${status}`),
          ),
        )
      }

      return Promise.reject(
        new ServerError(
          parseApiErrorMessage(errorData, status, `Server error: ${status}`),
          status,
        ),
      )
    }

    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
      const errorData = (error.response.data as any) || {}
      const data = errorData?.data ?? errorData

      // 403 with EMAIL_NOT_VERIFIED: preserve userId+email for redirect to verify page
      if (status === 403 && data?.code === 'EMAIL_NOT_VERIFIED' && data?.userId && data?.email) {
        throw new EmailNotVerifiedError(data.userId, data.email)
      }

      if (status >= 400 && status < 500) {
        if (status === 404) {
          throw new ValidationError(
            parseApiErrorMessage(errorData, status, 'Resource not found'),
          )
        }
        throw new ValidationError(
          parseApiErrorMessage(errorData, status, `Client error: ${status}`),
        )
      }

      if (status >= 500) {
        throw new ServerError(
          parseApiErrorMessage(errorData, status, `Server error: ${status}`),
          status,
        )
      }

      throw new ServerError(
        parseApiErrorMessage(errorData, status, `HTTP error: ${status}`),
        status,
      )
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

