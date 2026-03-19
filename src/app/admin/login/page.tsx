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
import { LockKeyhole, ArrowLeft, UserPlus } from 'lucide-react'
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

    if (!email.endsWith('@neu.edu.ph')) {
      setError('Unauthorized access. Admin credentials required.')
      setIsLoading(false)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/admin')
    } catch (err: any) {
      setError('Authentication failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-4 overflow-hidden relative">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <span className="text-[20vw] font-black text-white/5 uppercase select-none leading-none">ADMIN</span>
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
              <LockKeyhole className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-black uppercase italic tracking-tighter text-black">System Portal</CardTitle>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Administrator Gateway</p>
            </div>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="px-12 py-6 space-y-6">
              {error && (
                <Alert variant="destructive" className="mb-8 rounded-none border-2 border-destructive bg-transparent">
                  <AlertDescription className="font-bold uppercase text-xs text-destructive">{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-6">
                <Input
                  type="email"
                  placeholder="ADMIN@NEU.EDU.PH"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-14 border-x-0 border-t-0 border-b-2 border-primary bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-xl font-bold uppercase placeholder:text-gray-300 text-black"
                />
                <Input
                  type="password"
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-14 border-x-0 border-t-0 border-b-2 border-primary bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-xl font-bold uppercase placeholder:text-gray-300 text-black"
                />
              </div>
            </CardContent>
            <CardFooter className="px-12 pb-12 pt-6 flex flex-col gap-6">
              <Button type="submit" className="w-full h-16 bg-primary hover:bg-black text-white rounded-none text-xl font-black uppercase tracking-tighter" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Unlock Systems'}
              </Button>
              <div className="flex justify-between w-full">
                <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 hover:text-primary transition-colors">
                  <ArrowLeft className="h-3 w-3" />
                  Return to Visitor Portal
                </Link>
                <Link href="/admin/register" className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 hover:text-primary transition-colors">
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
