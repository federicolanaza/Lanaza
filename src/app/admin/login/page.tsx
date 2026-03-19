
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAuth } from '@/firebase'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { LockKeyhole, ArrowLeft, UserPlus, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const auth = useAuth()

  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!email.toLowerCase().endsWith('@neu.edu.ph')) {
      setError('Unauthorized: Administrator access requires an @neu.edu.ph institutional account.')
      setIsLoading(false)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/admin')
    } catch (err: any) {
      setError('Authentication Failure: Please check your institutional credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-6 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[25vw] font-black text-white/5 uppercase select-none leading-none tracking-tighter italic">ADMIN</span>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Card className="rounded-none border-none shadow-2xl overflow-hidden bg-white">
          <div className="h-2 bg-black/10 w-full" />
          <CardHeader className="space-y-4 p-12 pb-6">
            <div className="flex items-center justify-between">
              <div className="relative h-14 w-14 p-1 bg-white border border-black/5">
                <Image 
                  src={logo?.imageUrl || ''} 
                  alt="NEU Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <LockKeyhole className="h-8 w-8 text-black" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-4xl font-black uppercase italic tracking-tighter text-black leading-none">Security Portal</CardTitle>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">System Administrator Gateway</p>
            </div>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="px-12 py-6 space-y-8">
              {error && (
                <Alert variant="destructive" className="rounded-none border-2 border-destructive bg-transparent">
                  <AlertDescription className="font-bold uppercase text-[10px] tracking-widest text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">Admin Email</Label>
                  <Input
                    type="email"
                    placeholder="ADMIN@NEU.EDU.PH"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-14 border-x-0 border-t-0 border-b-2 border-black/10 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-black px-0 text-xl font-bold uppercase placeholder:text-black/5 text-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-black/50 ml-1">Access Password</Label>
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
            <CardFooter className="px-12 pb-12 pt-6 flex flex-col gap-6">
              <Button type="submit" className="w-full h-16 bg-black hover:bg-black/90 text-white rounded-none text-xl font-black uppercase tracking-tighter transition-all" disabled={isLoading}>
                {isLoading ? (
                   <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verifying...
                   </span>
                ) : 'Unlock Systems'}
              </Button>
              <div className="flex justify-between w-full">
                <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 hover:opacity-60 transition-all">
                  <ArrowLeft className="h-3 w-3" />
                  Visitor Entry
                </Link>
                <Link href="/admin/register" className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 hover:opacity-60 transition-all">
                  <UserPlus className="h-3 w-3" />
                  Enroll Admin
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
