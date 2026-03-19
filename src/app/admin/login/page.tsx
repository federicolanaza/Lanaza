
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useStore()

  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Admin-specific validation
    if (email !== 'admin@neu.edu.ph') {
      setError('Unauthorized access. Please use a valid administrator credential.')
      setIsLoading(false)
      return
    }

    try {
      login(email)
      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary/20 bg-white p-1">
            <Image 
              src={logo?.imageUrl || ''} 
              alt="NEU Logo" 
              fill 
              className="object-contain"
              data-ai-hint={logo?.imageHint}
            />
          </div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-white">LibreConnect Admin</h1>
          <p className="mt-2 text-slate-400 text-sm">Central Management System</p>
        </div>

        <Card className="border-none shadow-2xl bg-white">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-bold">Administrator Portal</CardTitle>
            <CardDescription>
              Enter secure credentials to access the analytics dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="grid gap-4">
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 text-destructive border-none">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@neu.edu.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-slate-50 border-slate-200"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-6" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Unlock Dashboard'}
              </Button>
              <Link href="/login" className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors">
                <ArrowLeft className="h-3 w-3" />
                Return to Visitor Login
              </Link>
            </CardFooter>
          </form>
        </Card>
        
        <p className="mt-8 text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          Secure Institutional Access • NEU
        </p>
      </div>
    </div>
  )
}
