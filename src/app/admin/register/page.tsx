
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useAuth, useFirestore } from '@/firebase'
import { errorEmitter } from '@/firebase/error-emitter'
import { FirestorePermissionError } from '@/firebase/errors'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, UserPlus, ShieldCheck } from 'lucide-react'
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
      setError('Only @neu.edu.ph institutional emails are permitted for administrator enrollment.')
      setIsLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Set display name in Auth
      await updateProfile(user, { displayName: fullName })

      const userRef = doc(db, 'users', user.uid)
      const userData = {
        id: user.uid,
        email: email.toLowerCase(),
        fullName: fullName,
        role: 'admin',
        createdAt: new Date().toISOString(),
      }

      setDoc(userRef, userData).catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: userData
        }))
      })

      const adminRef = doc(db, 'admins', user.uid)
      const adminData = { uid: user.uid, email: email.toLowerCase(), role: 'admin' }
      setDoc(adminRef, adminData).catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: adminRef.path,
          operation: 'create',
          requestResourceData: adminData
        }))
      })

      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'An error occurred during administrator registration.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-6 relative overflow-hidden">
      {/* Structural Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 border-t-[40px] border-r-[40px] border-white" />
        <div className="absolute bottom-0 left-0 w-96 h-96 border-b-[40px] border-l-[40px] border-white" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Card className="rounded-none border-none shadow-2xl overflow-hidden bg-white">
          <div className="h-1.5 bg-black/10 w-full" />
          <CardHeader className="space-y-6 p-10 pb-6">
            <div className="flex items-center justify-between">
              <div className="relative h-14 w-14 p-1 bg-white">
                <Image 
                  src={logo?.imageUrl || ''} 
                  alt="NEU Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <ShieldCheck className="h-10 w-10 text-black" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-4xl font-black uppercase italic tracking-tighter text-black leading-none">Admin Enrollment</CardTitle>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black opacity-60">Authorized Personnel Management</p>
            </div>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="px-10 py-6 space-y-8">
              {error && (
                <Alert variant="destructive" className="rounded-none border-2 border-destructive bg-transparent animate-in slide-in-from-top-2">
                  <AlertDescription className="font-bold uppercase text-[10px] tracking-wider text-destructive">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">Full Name</label>
                  <Input
                    placeholder="E.G. JUAN DELA CRUZ"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value.toUpperCase())}
                    disabled={isLoading}
                    required
                    className="h-14 border-x-0 border-t-0 border-b-2 border-black/20 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-black px-0 text-xl font-bold uppercase placeholder:text-black/10 text-black transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">Institutional Email</label>
                  <Input
                    type="email"
                    placeholder="ADMIN@NEU.EDU.PH"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    disabled={isLoading}
                    required
                    className="h-14 border-x-0 border-t-0 border-b-2 border-black/20 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-black px-0 text-xl font-bold uppercase placeholder:text-black/10 text-black transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">Secure Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-14 border-x-0 border-t-0 border-b-2 border-black/20 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-black px-0 text-xl font-bold uppercase placeholder:text-black/10 text-black transition-all"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="px-10 pb-12 pt-6 flex flex-col gap-6">
              <Button 
                type="submit" 
                className="w-full h-16 bg-black hover:bg-black/90 text-white rounded-none text-xl font-black uppercase tracking-tighter transition-all hover:scale-[1.01] active:scale-[0.99]" 
                disabled={isLoading}
              >
                {isLoading ? 'ENROLLING...' : (
                  <span className="flex items-center gap-3">
                    <UserPlus className="h-6 w-6" />
                    Complete Enrollment
                  </span>
                )}
              </Button>
              
              <div className="flex justify-center w-full">
                <Link href="/admin/login" className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 hover:opacity-70 transition-all group">
                  <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
                  Return to Admin Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
