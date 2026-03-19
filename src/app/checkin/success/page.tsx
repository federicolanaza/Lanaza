
"use client"

import Link from 'next/link'
import { CheckCircle2, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Check-in Complete</h1>
          <p className="text-slate-500 font-medium">Your request has been successfully recorded in the campus system.</p>
        </div>

        <div className="pt-4">
          <Link href="/">
            <Button className="w-full h-16 bg-primary text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
              <Home className="h-6 w-6 mr-2" /> Return Home
            </Button>
          </Link>
        </div>

        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest pt-8">
          Thank you for using the Unified Portal
        </p>
      </div>
    </div>
  )
}
