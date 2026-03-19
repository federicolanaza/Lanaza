
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
import { Book, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

const DEPARTMENTS = [
  'College of Engineering',
  'College of Computer Science',
  'College of Business Administration',
  'College of Nursing',
  'College of Law',
  'College of Education',
  'Arts and Sciences'
]

const DURATIONS = [
  'Less than 1 hour',
  '1-2 hours',
  '2-4 hours',
  'More than 4 hours'
]

export default function LibraryCheckin() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    idNumber: '',
    department: '',
    studyDuration: ''
  })
  const db = useFirestore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await addDoc(collection(db, 'library_logs'), {
        ...formData,
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
            <Book className="h-8 w-8" />
            <CardTitle className="text-3xl font-extrabold tracking-tight">Library Check-in</CardTitle>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">ID Number</Label>
              <Input 
                placeholder="20XX-XXXXX" 
                required 
                value={formData.idNumber}
                onChange={e => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                className="h-12 bg-slate-50 border-slate-200 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Department</Label>
              <Select onValueChange={val => setFormData(prev => ({ ...prev, department: val }))} required>
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Select your college" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Estimated Study Duration</Label>
              <Select onValueChange={val => setFormData(prev => ({ ...prev, studyDuration: val }))} required>
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="How long will you stay?" />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
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
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Complete Check-in'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
