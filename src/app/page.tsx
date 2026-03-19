
"use client"

import Link from 'next/link'
import { Book, Briefcase, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-primary">Campus Portal</h1>
          <p className="text-lg text-slate-500 font-medium">Please select a service module to proceed with your check-in.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/checkin/library" className="group">
            <Card className="bento-card h-full cursor-pointer navy-glow transform group-hover:-translate-y-1">
              <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                <div className="h-20 w-20 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Book className="h-10 w-10 text-primary group-hover:text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">Library Access</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Check-in for research, study sessions, or book borrowing services.
                  </p>
                </div>
                <div className="flex items-center text-primary font-bold text-sm">
                  PROCEED <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/checkin/dean" className="group">
            <Card className="bento-card h-full cursor-pointer navy-glow transform group-hover:-translate-y-1">
              <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                <div className="h-20 w-20 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Briefcase className="h-10 w-10 text-primary group-hover:text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">Dean's Office</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Queue for consultations, signatures, or administrative submissions.
                  </p>
                </div>
                <div className="flex items-center text-primary font-bold text-sm">
                  PROCEED <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <footer className="text-center pt-8">
          <p className="text-xs text-slate-400 uppercase tracking-[0.2em] font-bold">
            New Era University • Integrated Services
          </p>
        </footer>
      </div>
    </div>
  )
}
