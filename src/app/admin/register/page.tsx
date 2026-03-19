
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
import { Label } from '@/components/ui/label'
import { ArrowLeft, UserPlus, ShieldCheck, Loader2 } from 'lucide-react'
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

    const institutionalDomain = '@neu.edu.ph'
    if (!email.toLowerCase().endsWith(institutionalDomain)) {
      setError(`Access Denied: Only institutional accounts (${institutionalDomain}) are permitted for administrator registration.`)
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Security Requirement: Password must be at least 8 characters long.')
      setIsLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update Auth Profile
      await updateProfile(user, { displayName: fullName })

      // Create User Profile in Firestore
      const userRef = doc(db, 'users', user.uid)
      const userData = {
        id: user.uid,
        email: email.toLowerCase(),
        fullName: fullName,
        role: 'admin',
        createdAt: new Date().toISOString(),
      }

      // Non-blocking write to users collection
      setDoc(userRef, userData).catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: userData
        }))
      })

      // Create specialized Admin record for access control
      const adminRef = doc(db, 'admins', user.uid)
      const adminData = { 
        uid: user.uid, 
        email: email.toLowerCase(), 
        role: 'admin',
        enrolledAt: new Date().toISOString()
      }
      
      setDoc(adminRef, adminData).catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: adminRef.path,
          operation: 'create',
          requestResourceData: adminData
        }))
      })

      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during the registration process.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Card className="rounded-none border-none shadow-2xl overflow-hidden bg-white">
          <div className="h-2 bg-black/10 w-full" />
          <CardHeader className="space-y-6 p-10 pb-6">
            <div className="flex items-center justify-between">
              <div className="relative h-14 w-14 p-1 bg-white border border-black/5">
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
              <CardTitle className="text-4xl font-black uppercase italic tracking-tighter text-black leading-none">VirtuLab Admin</CardTitle>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Authorized Personnel Enrollment</p>
            </div>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="px-10 py-6 space-y-8">
              {error && (
                <Alert variant="destructive" className="rounded-none border-2 border-destructive bg-transparent">
                  <AlertDescription className="font-bold uppercase text-[10px] tracking-widest text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">Full Name</Label>
                  <Input
                    placeholder="ENTER FULL NAME"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value.toUpperCase())}
                    disabled={isLoading}
                    required
                    className="h-14 border-x-0 border-t-0 border-b-2 border-black/10 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-black px-0 text-xl font-bold uppercase placeholder:text-black/5 text-black"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">Institutional Email</Label>
                  <Input
                    type="email"
                    placeholder="USERNAME@NEU.EDU.PH"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    disabled={isLoading}
                    required
                    className="h-14 border-x-0 border-t-0 border-b-2 border-black/10 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-black px-0 text-xl font-bold uppercase placeholder:text-black/5 text-black"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">Secure Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-14 border-x-0 border-t-0 border-b-2 border-black/10 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-black px-0 text-xl font-bold uppercase placeholder:text-black/5 text-black"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="px-10 pb-12 pt-6 flex flex-col gap-6">
              <Button 
                type="submit" 
                className="w-full h-16 bg-black hover:bg-black/90 text-white rounded-none text-xl font-black uppercase tracking-tighter transition-all" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enrolling...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <UserPlus className="h-6 w-6" />
                    Complete Enrollment
                  </span>
                )}
              </Button>
              
              <div className="flex justify-center w-full">
                <Link href="/admin/login" className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 hover:opacity-60 transition-all">
                  <ArrowLeft className="h-3 w-3" />
                  Return to Admin Portal
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
