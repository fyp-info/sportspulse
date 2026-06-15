'use client'

import { useEffect } from 'react'

export default function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    fetch(`/api/posts/${postId}/view`, { method: 'POST' }).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
