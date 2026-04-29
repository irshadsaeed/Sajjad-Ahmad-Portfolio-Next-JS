'use client'

import { useCustomCursor } from '@/hooks/useCustomCursor'

export function CursorProvider() {
  useCustomCursor()
  return null
}