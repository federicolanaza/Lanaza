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
import { ArrowLeft, UserPlus } from 'lucide-react'
import Link from 'next/link'

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

    if (!email.toLowerCase().endsWith('@neu.edu.ph')) {
      setError('Only @neu.edu.ph institutional emails are permitted for admin registration.')
      setIsLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

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

      await setDoc(userRef, userData)

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
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <span className="text-[20vw] font-black text-white/5 uppercase select-none leading-none">ROOT</span>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Card className="rounded-none border-none shadow-2xl overflow-hidden creative-shadow bg-white">
          <div className="h-2 bg-black/10 w-full" />
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
              <UserPlus className="h-8 w-8 text-black" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-black uppercase italic tracking-tighter text-black">Admin Enrollment</CardTitle>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Authorized Personnel Creation</p>
            </div>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="px-12 py-6 space-y-8">
              {error && (
                <Alert variant="destructive" className="rounded-none border-2 border-destructive bg-transparent">
                  <AlertDescription className="font-bold uppercase text-xs text-destructive">{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-6">
                <Input
                  placeholder="FULL NAME"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-14 border-x-0 border-t-0 border-b-2 border-black/20 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-black px-0 text-xl font-bold uppercase placeholder:text-gray-400 text-black"
                />
                <Input
                  type="email"
                  placeholder="INSTITUTIONAL EMAIL (@NEU.EDU.PH)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-14 border-x-0 border-t-0 border-b-2 border-black/20 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-black px-0 text-xl font-bold uppercase placeholder:text-gray-400 text-black"
                />
                <Input
                  type="password"
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-14 border-x-0 border-t-0 border-b-2 border-black/20 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-black px-0 text-xl font-bold uppercase placeholder:text-gray-400 text-black"
                />
              </div>
            </CardContent>
            <CardFooter className="px-12 pb-12 pt-6 flex flex-col gap-6">
              <Button type="submit" className="w-full h-16 bg-black hover:bg-gray-800 text-white rounded-none text-xl font-black uppercase tracking-tighter transition-colors" disabled={isLoading}>
                {isLoading ? 'Creating Identity...' : 'Register Administrator'}
              </Button>
              <div className="flex justify-between w-full">
                <Link href="/admin/login" className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 hover:opacity-70 transition-all">
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
