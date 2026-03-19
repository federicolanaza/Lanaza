
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore, UserCategory } from '@/lib/store'
import { useFirestore } from '@/firebase'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'
import { errorEmitter } from '@/firebase/error-emitter'
import { FirestorePermissionError } from '@/firebase/errors'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { LogOut, ArrowRight, User as UserIcon, GraduationCap, Briefcase } from 'lucide-react'

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

const CATEGORIES: { id: UserCategory, label: string, icon: any }[] = [
  { id: 'Student', label: 'Student', icon: GraduationCap },
  { id: 'Faculty', label: 'Faculty', icon: Briefcase },
  { id: 'Staff', label: 'Support Staff', icon: UserIcon }
]

export default function VisitorPage() {
  const { currentUser, addVisit, logout } = useStore()
  const db = useFirestore()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    department: '',
    reasonForVisit: '',
    userCategory: '' as UserCategory | ''
  })

  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')

  useEffect(() => {
    if (currentUser) {
      toast({
        title: "Welcome to NEU Library!",
        description: `Authenticated as ${currentUser.email}`,
      })

      const sessionRef = doc(db, 'active_sessions', currentUser.id)
      const sessionData = {
        userId: currentUser.id,
        email: currentUser.email,
        userName: currentUser.name,
        role: 'Visitor',
        loginTime: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      }

      setDoc(sessionRef, sessionData, { merge: true }).catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: sessionRef.path,
          operation: 'write',
          requestResourceData: sessionData
        }))
      })

      const interval = setInterval(() => {
        const updateData = { lastSeen: new Date().toISOString() }
        setDoc(sessionRef, updateData, { merge: true }).catch(async (err) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: sessionRef.path,
            operation: 'update',
            requestResourceData: updateData
          }))
        })
      }, 60000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [currentUser, db, toast])

  if (!currentUser) return null

  const handleLogout = async () => {
    const sessionRef = doc(db, 'active_sessions', currentUser.id)
    deleteDoc(sessionRef).catch(async (err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: sessionRef.path,
        operation: 'delete'
      }))
    })
    logout()
    router.push('/login')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.department || !formData.reasonForVisit || !formData.userCategory) {
      toast({
        title: "Selection Required",
        description: "Please complete all fields for check-in.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      addVisit({
        department: formData.department,
        reasonForVisit: formData.reasonForVisit,
        userCategory: formData.userCategory as UserCategory
      })
      toast({
        title: "Check-in Successful!",
        description: "Welcome back. Enjoy your library session!",
      })
      setFormData({ department: '', reasonForVisit: '', userCategory: '' })
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
                  User Category
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userCategory: cat.id }))}
                      className={`h-24 px-4 flex flex-col items-center justify-center gap-2 text-xs font-bold uppercase tracking-tight border-2 transition-all ${
                        formData.userCategory === cat.id 
                        ? 'bg-black text-white border-black' 
                        : 'bg-transparent text-black border-black/10 hover:border-black'
                      }`}
                    >
                      <cat.icon className="h-6 w-6" />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

               <div className="space-y-6">
                <Label className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-black">
                  <span className="h-8 w-8 bg-primary text-white flex items-center justify-center not-italic text-sm">02</span>
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
                  <span className="h-8 w-8 bg-primary text-white flex items-center justify-center not-italic text-sm">03</span>
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
