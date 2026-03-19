
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth, useFirestore } from '@/firebase'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LockKeyhole, ArrowLeft, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { errorEmitter } from '@/firebase/error-emitter'
import { FirestorePermissionError } from '@/firebase/errors'

export default function AdminRegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const auth = useAuth()
  const db = useFirestore()

  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Strict validation for institutional email
    if (!email.toLowerCase().endsWith('@neu.edu.ph')) {
      setError('Only @neu.edu.ph institutional emails are permitted for admin registration.')
      setIsLoading(false)
      return
    }

    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // 2. Initialize the user profile in Firestore
      const userRef = doc(db, 'users', user.uid)
      const userData = {
        id: user.uid,
        email: email.toLowerCase(),
        fullName: fullName,
        role: 'admin',
        isBlocked: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Use setDoc for initial profile creation
      await setDoc(userRef, userData)

      // 3. Create an admin marker in the 'admins' collection
      // This collection is used by Security Rules for robust permission checks via exists()
      const adminRef = doc(db, 'admins', user.uid)
      await setDoc(adminRef, { uid: user.uid })

      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-4 overflow-hidden relative">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <span className="text-[20vw] font-black text-white/5 uppercase select-none leading-none">ROOT</span>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Card className="rounded-none border-none shadow-2xl overflow-hidden creative-shadow">
          <div className="h-2 bg-white/20 w-full" />
          <CardHeader className="space-y-4 p-12 pb-6">
            <div className="flex items-center justify-between">
              <div className="relative h-12 w-12 p-1 bg-white">
                <Image 
                  src={logo?.imageUrl || ''} 
                  alt="NEU Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-black uppercase italic tracking-tighter">Admin Enrollment</CardTitle>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Authorized Personnel Creation</p>
            </div>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="px-12 py-6 space-y-8">
              {error && (
                <Alert variant="destructive" className="rounded-none border-2 border-destructive bg-transparent">
                  <AlertDescription className="font-bold uppercase text-xs">{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-6">
                <Input
                  placeholder="FULL NAME"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-14 border-x-0 border-t-0 border-b-2 border-primary/10 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-xl font-bold uppercase placeholder:text-primary/5"
                />
                <Input
                  type="email"
                  placeholder="INSTITUTIONAL EMAIL (@NEU.EDU.PH)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-14 border-x-0 border-t-0 border-b-2 border-primary/10 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-xl font-bold uppercase placeholder:text-primary/5"
                />
                <Input
                  type="password"
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-14 border-x-0 border-t-0 border-b-2 border-primary/10 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-xl font-bold uppercase placeholder:text-primary/5"
                />
              </div>
            </CardContent>
            <CardFooter className="px-12 pb-12 pt-6 flex flex-col gap-6">
              <Button type="submit" className="w-full h-16 bg-primary hover:bg-black text-white rounded-none text-xl font-black uppercase tracking-tighter" disabled={isLoading}>
                {isLoading ? 'Creating Identity...' : 'Register Administrator'}
              </Button>
              <div className="flex justify-between w-full">
                <Link href="/admin/login" className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2 hover:text-primary transition-colors">
                  <ArrowLeft className="h-3 w-3" />
                  Existing Admin? Return to Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
