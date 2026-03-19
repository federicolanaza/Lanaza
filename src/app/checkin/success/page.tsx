"use client"

import Link from 'next/link'
import { CheckCircle2, Home, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-10 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="h-32 w-32 bg-green-500/10 rounded-[2rem] flex items-center justify-center shadow-inner">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">Submission Success</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed px-4">
            Your check-in has been validated and recorded in the VirtuLab database.
          </p>
        </div>

        <div className="pt-4 px-6">
          <Link href="/">
            <Button className="w-full h-16 bg-primary text-white text-xl font-black uppercase tracking-tighter rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
              <Home className="h-6 w-6 mr-3" /> Return Home
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 pt-8">
          <span>Validated</span>
          <div className="h-1 w-1 rounded-full bg-slate-300" />
          <span>Secured</span>
        </div>
      </div>
    </div>
  )
}