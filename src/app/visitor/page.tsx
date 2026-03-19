"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { LogOut, CheckCircle2, MapPin, Sparkles } from 'lucide-react'

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
        description: `Logged in as ${currentUser.name}`,
      })
    }
  }, [])

  if (!currentUser) return null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.department || !formData.reasonForVisit) {
      toast({
        title: "Information Required",
        description: "Please select your department and the purpose of your visit.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      addVisit(formData)
      toast({
        title: "Check-in Complete!",
        description: "Welcome back to the library. Have a productive session!",
      })
      setFormData({ department: '', reasonForVisit: '' })
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-primary/20 bg-white p-1">
              <Image 
                src={logo?.imageUrl || ''} 
                alt="NEU Logo" 
                fill 
                className="object-contain"
                data-ai-hint={logo?.imageHint}
              />
            </div>
            <div>
              <span className="font-headline text-xl font-bold text-slate-900 block leading-none tracking-tight">LibreConnect</span>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-widest mt-1">Visitor Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
               <MapPin className="h-3 w-3" />
               Main Library
             </div>
             <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-destructive transition-colors">
               <LogOut className="mr-2 h-4 w-4" />
               Exit
             </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-xl px-6 py-12">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
             <Sparkles className="h-3 w-3" />
             Institutional Access
          </div>
          <h1 className="font-headline text-4xl font-black text-slate-900 tracking-tight">Welcome, {currentUser.name.split(' ')[0]}!</h1>
          <p className="mt-3 text-slate-600 font-medium">Please finalize your check-in to access library resources.</p>
        </div>

        <Card className="border-none shadow-2xl ring-1 ring-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Entry Declaration</CardTitle>
                <CardDescription className="font-medium">{currentUser.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="department" className="text-sm font-bold text-slate-700">College Department</Label>
                <select 
                  className="flex h-12 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  value={formData.department}
                >
                  <option value="" disabled>Select your department</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="purpose" className="text-sm font-bold text-slate-700">Purpose of Visit</Label>
                <select 
                  className="flex h-12 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => setFormData(prev => ({ ...prev, reasonForVisit: e.target.value }))}
                  value={formData.reasonForVisit}
                >
                  <option value="" disabled>What is your primary purpose?</option>
                  {PURPOSES.map(purpose => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-7 text-lg font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98]" disabled={isSubmitting}>
                {isSubmitting ? (
                  'Validating Credentials...'
                ) : (
                  'Confirm Check-in'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <footer className="mt-12 text-center">
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            By checking in, you agree to comply with the <br />
            <span className="underline cursor-pointer hover:text-primary">Library Code of Conduct</span> and data privacy policies.
          </p>
        </footer>
      </main>
      <Toaster />
    </div>
  )
}
