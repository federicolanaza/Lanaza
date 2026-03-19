
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { useFirestore } from '@/firebase'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { LogOut, ArrowRight } from 'lucide-react'

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
  const db = useFirestore()
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
        description: `Authenticated as ${currentUser.email}`,
      })

      // Track Visitor Session
      const sessionRef = doc(db, 'active_sessions', currentUser.id)
      setDoc(sessionRef, {
        userId: currentUser.id,
        email: currentUser.email,
        userName: currentUser.name,
        role: 'Visitor',
        loginTime: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      }, { merge: true })

      const interval = setInterval(() => {
        setDoc(sessionRef, { lastSeen: new Date().toISOString() }, { merge: true })
      }, 60000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [currentUser, db, toast])

  if (!currentUser) return null

  const handleLogout = async () => {
    const sessionRef = doc(db, 'active_sessions', currentUser.id)
    await deleteDoc(sessionRef)
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
    <div className="min-h-screen bg-white text-black">
      <nav className="border-b border-primary/10 py-8">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="relative h-12 w-12">
               <Image 
                src={logo?.imageUrl || ''} 
                alt="NEU Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-black">VirtuLib</h1>
          </div>
          <Button variant="outline" className="rounded-none border-black font-black uppercase tracking-widest text-[10px] text-black hover:bg-black hover:text-white" onClick={handleLogout}>
            Exit Session
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row gap-20">
        <div className="lg:w-1/3 space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black block">System Identity</span>
            <h2 className="text-3xl font-black italic uppercase leading-tight tracking-tighter text-black break-words">
              {currentUser.name}
            </h2>
          </div>

          <div className="space-y-6 pt-8 border-t border-primary/10">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-black">Institutional Email</span>
              <span className="text-lg font-bold text-black truncate">{currentUser.email}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-black">Access Type</span>
              <span className="text-lg font-bold text-black uppercase">{currentUser.role}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 lg:max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-16">
            <div className="space-y-12">
               <div className="space-y-6">
                <Label className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-black">
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
                        ? 'bg-black text-white border-black' 
                        : 'bg-transparent text-black border-black/10 hover:border-black'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Label className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-black">
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
                        ? 'bg-black text-white border-black' 
                        : 'bg-transparent text-black border-black/10 hover:border-black'
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

      <footer className="mt-20 py-12 border-t border-primary/10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">
          New Era University • Library Services Management
        </p>
      </footer>
      <Toaster />
    </div>
  )
}
