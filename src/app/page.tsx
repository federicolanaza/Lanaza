
"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Book, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 lg:p-12">
      {/* Header Area */}
      <div className="mb-16 flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="relative h-20 w-20 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <Image 
            src={logo?.imageUrl || ''} 
            alt="NEU Logo" 
            fill 
            className="object-contain p-2"
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">VirtuLab</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Unified Campus Portal</p>
        </div>
      </div>

      {/* Choice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        <Link href="/checkin/library" className="group">
          <Card className="bento-card h-full border-none shadow-lg overflow-hidden relative choice-card-glow">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Book className="h-32 w-32" />
            </div>
            <CardHeader className="p-10 space-y-4">
              <div className="h-16 w-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                <Book className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-black text-slate-900">Library Access</CardTitle>
                <CardDescription className="text-slate-500 text-lg font-medium leading-relaxed">
                  Log your study sessions and access academic resources.
                </CardDescription>
              </div>
              <div className="pt-6 flex items-center text-primary font-black uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform">
                Enter Portal <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/checkin/dean" className="group">
          <Card className="bento-card h-full border-none shadow-lg overflow-hidden relative choice-card-glow">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Briefcase className="h-32 w-32" />
            </div>
            <CardHeader className="p-10 space-y-4">
              <div className="h-16 w-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                <Briefcase className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-black text-slate-900">Dean's Office</CardTitle>
                <CardDescription className="text-slate-500 text-lg font-medium leading-relaxed">
                  Join the queue for signatures, consultations, or document submission.
                </CardDescription>
              </div>
              <div className="pt-6 flex items-center text-primary font-black uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform">
                Queue System <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Admin Control - Prominent Entry Point */}
      <div className="mt-16 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Link href="/admin/login" className="block">
          <Button 
            variant="outline" 
            className="w-full h-16 bg-white border-2 border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 rounded-2xl transition-all group shadow-sm flex items-center justify-center"
          >
            <ShieldCheck className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em]">Administrative Control Center</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
