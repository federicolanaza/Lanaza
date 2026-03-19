"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { LogOut, ArrowRight, MapPin, Sparkles, User, GraduationCap, Fingerprint } from 'lucide-react'

const DEPARTMENTS = [
  'College of Engineering',
  'College of Computer Science',
  'College of Business Administration',
  'College of Nursing',
  'College of Law',
  'College of Education',
  'Arts and Sciences'
]

const PURPOSES = [
  'Research / Thesis Work',
  'Individual Study / Review',
  'Group Collaboration',
  'Book Borrowing / Return',
  'Internet / Computer Access',
  'Clearance / Administrative',
  'Library Orientation'
]

export default function VisitorPage() {
  const { currentUser, addVisit, logout } = useStore()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    department: '',
    reasonForVisit: ''
  })

  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')

  useEffect(() => {
    if (currentUser) {
      toast({
        title: "Welcome to NEU Library!",
        description: `Authenticated as ${currentUser.name}`,
      })
    }
  }, [currentUser])

  if (!currentUser) return null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.department || !formData.reasonForVisit) {
      toast({
        title: "Selection Required",
        description: "Please specify your department and purpose.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      addVisit(formData)
      toast({
        title: "Check-in Successful!",
        description: "Welcome back. Enjoy your library session!",
      })
      setFormData({ department: '', reasonForVisit: '' })
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-white text-primary">
      {/* Dynamic Header */}
      <nav className="border-b border-primary/5 py-8">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="relative h-12 w-12 grayscale hover:grayscale-0 transition-all">
               <Image 
                src={logo?.imageUrl || ''} 
                alt="NEU Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">VirtuLib</h1>
          </div>
          <Button variant="outline" className="rounded-none border-primary font-black uppercase tracking-widest text-[10px]" onClick={handleLogout}>
            Exit Session
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row gap-20">
        {/* Identity Panel */}
        <div className="lg:w-1/3 space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground block">Verified Identity</span>
            <h2 className="text-6xl font-black italic uppercase leading-[0.9] tracking-tighter">
              {currentUser.name.split(' ')[0]}<br />{currentUser.name.split(' ')[1] || ''}
            </h2>
          </div>

          <div className="space-y-6 pt-8 border-t border-primary/10">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student ID</span>
              <span className="text-2xl font-black">{currentUser.studentId}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</span>
              <span className="text-lg font-bold opacity-60 truncate">{currentUser.email}</span>
            </div>
          </div>
        </div>

        {/* Declaration Form */}
        <div className="flex-1 lg:max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-16">
            <div className="space-y-12">
               <div className="space-y-6">
                <Label className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                  <span className="h-8 w-8 bg-primary text-white flex items-center justify-center not-italic text-sm">01</span>
                  Select Department
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DEPARTMENTS.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, department: dept }))}
                      className={`h-14 px-6 text-left text-sm font-bold uppercase tracking-tight border-2 transition-all ${
                        formData.department === dept 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-transparent text-primary border-primary/10 hover:border-primary'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Label className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                  <span className="h-8 w-8 bg-primary text-white flex items-center justify-center not-italic text-sm">02</span>
                  Purpose of Visit
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PURPOSES.map((purpose) => (
                    <button
                      key={purpose}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, reasonForVisit: purpose }))}
                      className={`h-14 px-6 text-left text-sm font-bold uppercase tracking-tight border-2 transition-all ${
                        formData.reasonForVisit === purpose 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-transparent text-primary border-primary/10 hover:border-primary'
                      }`}
                    >
                      {purpose}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-20 bg-primary hover:bg-black text-white rounded-none text-2xl font-black uppercase tracking-tighter group transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording Visit...' : (
                <span className="flex items-center gap-3">
                  Complete Check-in
                  <ArrowRight className="h-8 w-8 transition-transform group-hover:translate-x-3" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </main>

      <footer className="mt-20 py-12 border-t border-primary/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
          New Era University • Library Services Management
        </p>
      </footer>
      <Toaster />
    </div>
  )
}
