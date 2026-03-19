"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Settings, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react'
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
          <h1 className="text-6xl font-black leading-tight mb-6 tracking-tighter italic">VIRTU<br />LIB.</h1>
          <p className="text-xl text-white font-medium tracking-wide">
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
            <h1 className="text-3xl font-black uppercase tracking-tighter italic text-black">VirtuLib</h1>
          </div>

          <div className="space-y-2 mb-10">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-black">Visitor Identity</h2>
            <p className="text-black font-black uppercase text-[10px] tracking-[0.3em]">Institutional Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-2 border-destructive bg-transparent rounded-none">
                <AlertDescription className="font-bold uppercase text-xs">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-black">Institutional Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="NAME@NEU.EDU.PH"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 border-x-0 border-t-0 border-b-2 border-primary bg-transparent rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-xl font-bold uppercase placeholder:text-gray-300 text-black"
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
                <span className="flex items-center gap-3">
                  Verify Access
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-3" />
                </span>
              )}
            </Button>
            
            {/* Design Domain for Admin Links */}
            <div className="pt-12 mt-8 border-t border-primary/10">
              <div className="p-8 bg-gray-50 border border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 rotate-45 group-hover:bg-primary/10 transition-all duration-500" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="h-4 w-4 text-black" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">System Infrastructure</span>
                  </div>

                  <div className="grid gap-4">
                    <Link 
                      href="/admin/login" 
                      className="group/link flex items-center justify-between p-4 border border-primary/10 bg-white hover:border-primary transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="h-4 w-4 text-black group-hover/link:rotate-90 transition-transform duration-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-black">Control Center</span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-black group-hover/link:translate-x-1 transition-all" />
                    </Link>

                    <Link 
                      href="/admin/register" 
                      className="group/link flex items-center justify-between p-4 border border-primary/10 bg-white hover:border-primary transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <UserPlus className="h-4 w-4 text-black group-hover/link:scale-110 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-black">Enroll Admin</span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-black group-hover/link:translate-x-1 transition-all" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
