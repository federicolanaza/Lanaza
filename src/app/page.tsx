"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Book, Briefcase, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PlaceHolderImages } from '@/lib/placeholder-images'

export default function LandingPage() {
  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative h-20 w-20 md:h-24 md:w-24 transition-transform hover:scale-105 duration-700 animate-in fade-in zoom-in">
              <Image 
                src={logo?.imageUrl || ''} 
                alt="NEU Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-primary italic uppercase leading-none">VirtuLab</h1>
            <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto">
              Welcome to the New Era University Integrated Services. Please select a module to proceed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/checkin/library" className="group">
            <Card className="bento-card h-full cursor-pointer navy-glow transform group-hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-primary/20">
              <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                <div className="h-24 w-24 bg-primary/5 rounded-3xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                  <Book className="h-12 w-12 text-primary group-hover:text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Library Access</h2>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    Check-in for research, study sessions, or book borrowing services.
                  </p>
                </div>
                <div className="flex items-center text-primary font-black text-sm tracking-widest uppercase">
                  PROCEED <ChevronRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/checkin/dean" className="group">
            <Card className="bento-card h-full cursor-pointer navy-glow transform group-hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-primary/20">
              <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                <div className="h-24 w-24 bg-primary/5 rounded-3xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:-rotate-6">
                  <Briefcase className="h-12 w-12 text-primary group-hover:text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Dean's Office</h2>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    Queue for consultations, signatures, or administrative submissions.
                  </p>
                </div>
                <div className="flex items-center text-primary font-black text-sm tracking-widest uppercase">
                  PROCEED <ChevronRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-2" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <footer className="text-center pt-8">
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-black">
            New Era University • Integrated Services Management
          </p>
        </footer>
      </div>
    </div>
  )
}
