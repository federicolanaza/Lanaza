"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { LogOut, CheckCircle2, Library } from 'lucide-react'

const DEPARTMENTS = [
  'College of Engineering',
  'College of Computer Science',
  'College of Business Administration',
  'College of Nursing',
  'College of Law',
  'College of Education',
  'Arts and Sciences'
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

  if (!currentUser) return null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.department || !formData.reasonForVisit) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all fields before submitting.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      addVisit(formData)
      toast({
        title: "Welcome to NEU Library!",
        description: "Your check-in was successful. Enjoy your stay!",
        variant: "default",
      })
      setFormData({ department: '', reasonForVisit: '' })
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Library className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold text-primary">LibreConnect</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>

      <main className="mx-auto max-w-xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-3xl font-bold text-foreground">Library Check-in</h1>
          <p className="mt-2 text-muted-foreground">Please provide a few details for your visit today.</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Visitor Information</CardTitle>
                <CardDescription>Logged in as {currentUser.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="department">College Department</Label>
                <Select 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, department: v }))}
                  value={formData.department}
                >
                  <SelectTrigger className="bg-muted/30 border-muted">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Textarea
                  id="reason"
                  placeholder="e.g., Research, Group Study, Printing services..."
                  className="min-h-[120px] bg-muted/30 border-muted resize-none"
                  value={formData.reasonForVisit}
                  onChange={(e) => setFormData(prev => ({ ...prev, reasonForVisit: e.target.value }))}
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-6 text-lg font-medium" disabled={isSubmitting}>
                {isSubmitting ? 'Checking in...' : 'Submit Check-in'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 rounded-xl bg-accent/5 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Thank you for helping us improve library services through accurate data collection.
          </p>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
