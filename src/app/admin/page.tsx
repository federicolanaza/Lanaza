
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useUser, useDoc, useFirestore, useAuth, useMemoFirebase } from '@/firebase'
import { doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { StatCards } from '@/components/admin/StatCards'
import { UserTable } from '@/components/admin/UserTable'
import { AiTrends } from '@/components/admin/AiTrends'
import { VisitorChart } from '@/components/admin/VisitorChart'
import { ActiveSessions } from '@/components/admin/ActiveSessions'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  LogOut, 
  Bell,
  Search as SearchIcon,
  Settings,
  ArrowUpRight,
  Loader2,
  UserPlus,
  Monitor
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { signOut } from 'firebase/auth'
import Link from 'next/link'

export default function AdminPage() {
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const db = useFirestore()
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const adminDocRef = useMemoFirebase(() => {
    if (!user) return null
    return doc(db, 'admins', user.uid)
  }, [user, db])

  const { data: adminData, isLoading: isAdminDataLoading } = useDoc(adminDocRef)

  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin/login')
    }
  }, [user, isUserLoading, router])

  useEffect(() => {
    if (user && adminData) {
      // Record admin session
      const sessionRef = doc(db, 'active_sessions', user.uid)
      setDoc(sessionRef, {
        userId: user.uid,
        email: user.email,
        userName: user.displayName || 'Admin',
        role: 'Admin',
        loginTime: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      }, { merge: true })

      const interval = setInterval(() => {
        setDoc(sessionRef, { lastSeen: new Date().toISOString() }, { merge: true })
      }, 60000)

      return () => clearInterval(interval)
    }
  }, [user, adminData, db])

  if (isUserLoading || isAdminDataLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !adminData) return null

  const handleLogout = async () => {
    const sessionRef = doc(db, 'active_sessions', user.uid)
    await deleteDoc(sessionRef)
    await signOut(auth)
    router.push('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white p-1 ring-2 ring-primary/20">
            <Image 
              src={logo?.imageUrl || ''} 
              alt="NEU Logo" 
              fill 
              className="object-contain p-0.5"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-lg font-bold text-sidebar-foreground leading-none">VirtuLib</span>
            <span className="text-[10px] text-sidebar-foreground/60 font-medium uppercase tracking-widest mt-1">Analytics</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-1 p-4 pt-6">
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 ${activeTab === 'overview' ? 'bg-sidebar-accent shadow-sm' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard className="mr-3 h-4 w-4" />
            Overview
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 ${activeTab === 'users' ? 'bg-sidebar-accent shadow-sm' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users className="mr-3 h-4 w-4" />
            Users
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 ${activeTab === 'trends' ? 'bg-sidebar-accent shadow-sm' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            <Sparkles className="mr-3 h-4 w-4 text-amber-400" />
            AI Trends
          </Button>
        </div>

        <div className="p-4 border-t border-sidebar-border bg-black/10">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate text-sidebar-foreground">{user.displayName || user.email}</span>
              <span className="text-xs text-sidebar-foreground/50 truncate">Administrator</span>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground h-9" onClick={handleLogout}>
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b bg-card flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative max-w-md w-full hidden lg:block">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search records, users, or reports..." className="pl-10 bg-muted/50 border-none h-11 focus-visible:ring-primary/20" />
             </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 mr-4 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse mr-1.5" />
              Live System
            </div>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline text-3xl font-bold text-foreground tracking-tight">
                {activeTab === 'overview' && 'System Overview'}
                {activeTab === 'users' && 'User Directory'}
                {activeTab === 'trends' && 'AI Insight Center'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {activeTab === 'overview' && 'Centralized dashboard for real-time facility metrics.'}
                {activeTab === 'users' && 'Directory of all registered university stakeholders.'}
                {activeTab === 'trends' && 'Advanced behavioral analytics and predictive insights.'}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/register">
                <Button variant="outline" className="shadow-sm gap-2">
                  <UserPlus className="h-4 w-4" />
                  Enroll Admin
                </Button>
              </Link>
              <Button className="bg-primary shadow-lg shadow-primary/20">
                Refresh Data
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="overview" className="space-y-8 mt-0 border-none p-0 outline-none">
              <StatCards visits={[]} />
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-none shadow-sm ring-1 ring-border">
                     <CardHeader className="flex flex-row items-center justify-between">
                       <div>
                         <CardTitle className="text-xl">Visitor Trends</CardTitle>
                         <CardDescription>Daily check-in volume over the last 7 days.</CardDescription>
                       </div>
                       <Button variant="ghost" size="sm" className="text-primary gap-1">
                         View Details <ArrowUpRight className="h-3 w-3" />
                       </Button>
                     </CardHeader>
                     <CardContent className="pt-2">
                        <VisitorChart visits={[]} />
                     </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-1">
                  <ActiveSessions />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-0 border-none p-0 outline-none">
              <UserTable />
            </TabsContent>

            <TabsContent value="trends" className="mt-0 border-none p-0 outline-none">
              <AiTrends />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
