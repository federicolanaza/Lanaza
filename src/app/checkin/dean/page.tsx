
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFirestore } from '@/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Briefcase, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

const PURPOSES = [
  'Signature',
  'Consultation',
  'Document Submission'
]

export default function DeanCheckin() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    visitorName: '',
    studentId: '',
    purpose: ''
  })
  const db = useFirestore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await addDoc(collection(db, 'dean_logs'), {
        ...formData,
        status: 'Waiting',
        timestamp: serverTimestamp()
      })
      router.push('/checkin/success')
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full bento-card border-none shadow-2xl">
        <CardHeader className="bg-primary text-white p-8 space-y-4">
          <Link href="/" className="text-white/70 hover:text-white flex items-center text-xs font-bold uppercase tracking-widest transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Choice
          </Link>
          <div className="flex items-center gap-4">
            <Briefcase className="h-8 w-8" />
            <CardTitle className="text-3xl font-extrabold tracking-tight">Dean's Office</CardTitle>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Visitor Name</Label>
              <Input 
                placeholder="Full Name" 
                required 
                value={formData.visitorName}
                onChange={e => setFormData(prev => ({ ...prev, visitorName: e.target.value }))}
                className="h-12 bg-slate-50 border-slate-200 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Student ID</Label>
              <Input 
                placeholder="20XX-XXXXX" 
                required 
                value={formData.studentId}
                onChange={e => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                className="h-12 bg-slate-50 border-slate-200 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Purpose of Visit</Label>
              <Select onValueChange={val => setFormData(prev => ({ ...prev, purpose: val }))} required>
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Reason for your visit" />
                </SelectTrigger>
                <SelectContent>
                  {PURPOSES.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="p-8 pt-0">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-primary text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enter Queue'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
