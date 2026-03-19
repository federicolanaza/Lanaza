
"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { currentUser } = useStore()

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login')
    } else if (currentUser.role === 'Admin') {
      router.replace('/admin')
    } else {
      router.replace('/visitor')
    }
  }, [currentUser, router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Loading LibreConnect...</p>
      </div>
    </div>
  )
}
