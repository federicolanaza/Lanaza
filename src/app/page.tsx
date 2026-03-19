"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'

export default function RootPage() {
  const router = useRouter()
  const { currentUser } = useStore()

  useEffect(() => {
    if (currentUser) {
      router.push('/visitor')
    } else {
      router.push('/login')
    }
  }, [currentUser, router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="h-8 w-8 border-4 border-black border-t-transparent animate-spin rounded-full" />
    </div>
  )
}