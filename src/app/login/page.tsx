"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Settings, ArrowRight, UserPlus } from 'lucide-react'
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

    if (!email.toLowerCase().endsWith('@neu.edu.ph')) {
      setError('Please use your institutional @neu.edu.ph email address.')
      setIsLoading(false)
      return
    }

    try {
      login(email.toLowerCase())
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-stretch bg-white">
      {/* Left Visual Side */}
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 border-t-8 border-l-8 border-white" />
          <div className="absolute bottom-0 right-0 w-64 h-64 border-b-8 border-r-8 border-white" />
        </div>
        <div className="relative z-10 text-white max-w-lg">
          <div className="mb-8 relative h-32 w-32 overflow-hidden rounded-full bg-white p-2">
            <Image 
              src={logo?.imageUrl || ''} 
              alt="NEU Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <h1 className="text-6xl font-black leading-tight mb-6">VIRTU<br />LIB.</h1>
          <p className="text-xl text-white/70 font-medium tracking-wide">
            The future of library visitor management at New Era University. Secure, seamless, and data-driven.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-12 lg:hidden">
            <div className="relative h-16 w-16 mb-4">
               <Image 
                src={logo?.imageUrl || ''} 
                alt="NEU Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">VirtuLib</h1>
          </div>

          <div className="space-y-2 mb-10">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Visitor Identity</h2>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.2em]">Institutional Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-2 border-destructive bg-transparent rounded-none">
                <AlertDescription className="font-bold">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-primary/50">Institutional Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="NAME@NEU.EDU.PH"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 border-x-0 border-t-0 border-b-2 border-primary/10 bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-lg font-bold uppercase placeholder:text-primary/10"
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 bg-primary hover:bg-black text-white rounded-none text-xl font-black uppercase tracking-tighter group transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'VERIFYING...' : (
                <span className="flex items-center gap-2">
                  Verify Access
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                </span>
              )}
            </Button>
            
            <div className="pt-8 flex flex-col items-center gap-4">
              <Link 
                href="/admin/login" 
                className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center gap-2"
              >
                <Settings className="h-3 w-3" />
                Administrator Control Center
              </Link>
              <Link 
                href="/admin/register" 
                className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center gap-2"
              >
                <UserPlus className="h-3 w-3" />
                Enroll New Administrator
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
