
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
import { Info, UserCircle, Settings } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
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

    if (!email.endsWith('@neu.edu.ph')) {
      setError('Please use your institutional @neu.edu.ph email address.')
      setIsLoading(false)
      return
    }

    try {
      login(email)
      // The redirect is handled by /page.tsx after state update, 
      // but we can also push here for immediate feedback if they are already stored
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-xl bg-white p-1">
            <Image 
              src={logo?.imageUrl || ''} 
              alt="NEU Logo" 
              fill 
              className="object-contain"
              data-ai-hint={logo?.imageHint}
            />
          </div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">LibreConnect</h1>
          <p className="mt-2 text-muted-foreground font-medium">NEU Library Visitor Portal</p>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 text-primary mb-2">
              <UserCircle className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Visitor Access</span>
            </div>
            <CardTitle className="text-2xl font-bold">Institutional Sign-in</CardTitle>
            <CardDescription>
              Enter your official university email to log your visit
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="grid gap-4">
              {error && (
                <Alert variant="destructive" className="border-none bg-destructive/10 text-destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@neu.edu.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-muted/50 border-muted h-12"
                />
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-700 font-medium">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Visitor check-in is required for all university stakeholders entering the premises.</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-bold" disabled={isLoading}>
                {isLoading ? 'Checking records...' : 'Verify Institutional Identity'}
              </Button>
              
              <div className="w-full pt-4 border-t flex justify-center">
                <Link 
                  href="/admin/login" 
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  <Settings className="h-3 w-3" />
                  Administrator Control Center
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <p className="mt-12 text-center text-xs text-muted-foreground font-medium uppercase tracking-widest">
          New Era University Library Services
        </p>
      </div>
    </div>
  )
}
