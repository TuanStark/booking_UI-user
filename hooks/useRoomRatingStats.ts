'use client'

import { useEffect, useState } from 'react'
import apiClient from '@/services/apiClient'

export function useRoomRatingStats(roomId: string | undefined) {
  const [state, setState] = useState({
    averageRating: 0,
    totalReviews: 0,
    loading: Boolean(roomId),
  })

  useEffect(() => {
    if (!roomId) {
      setState({ averageRating: 0, totalReviews: 0, loading: false })
      return
    }

    let cancelled = false
    setState((s) => ({ ...s, loading: true }))

    ;(async () => {
      try {
        const s = await apiClient.getRoomRatingStats(roomId)
        if (cancelled) return
        const total = typeof s?.totalReviews === 'number' ? s.totalReviews : 0
        const avgRaw = s?.avgRating
        const averageRating =
          avgRaw != null && avgRaw !== '' ? Number(avgRaw) : 0
        setState({
          totalReviews: total,
          averageRating: Number.isFinite(averageRating) ? averageRating : 0,
          loading: false,
        })
      } catch {
        if (!cancelled) {
          setState({ averageRating: 0, totalReviews: 0, loading: false })
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [roomId])

  return state
}
