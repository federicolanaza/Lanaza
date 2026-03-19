"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { StatCards } from '@/components/admin/StatCards'
import { UserTable } from '@/components/admin/UserTable'
import { AiTrends } from '@/components/admin/AiTrends'
import { VisitorChart } from '@/components/admin/VisitorChart'
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
  ArrowUpRight
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function AdminPage() {
  const { currentUser, logout, visits } = useStore()
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'Admin') {
      router.push('/admin/login')
    } else {
      toast({
        title: "Welcome to NEU Library!",
        description: "Administrative access granted.",
      })
    }
  }, [currentUser, router])

  if (!currentUser || currentUser.role !== 'Admin') return null

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white p-1 ring-2 ring-primary/20">
            <Image 
              src={logo?.imageUrl || ''} 
              alt="NEU Logo" 
              fill 
              className="object-contain p-0.5"
              data-ai-hint={logo?.imageHint}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-lg font-bold text-sidebar-foreground leading-none">LibreConnect</span>
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
              <span className="text-sm font-semibold truncate text-sidebar-foreground">{currentUser.name}</span>
              <span className="text-xs text-sidebar-foreground/50 truncate">Administrator</span>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground h-9" onClick={handleLogout}>
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
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
              <Button variant="outline" className="shadow-sm">
                Generate Report
              </Button>
              <Button className="bg-primary shadow-lg shadow-primary/20">
                Refresh Data
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="overview" className="space-y-8 mt-0 border-none p-0 outline-none">
              <StatCards visits={visits} />
              
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-border">
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
                      <VisitorChart visits={visits} />
                   </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-border h-full">
                   <CardHeader>
                     <CardTitle className="text-xl">Recent Activity</CardTitle>
                     <CardDescription>Latest visitor arrivals.</CardDescription>
                   </CardHeader>
                   <CardContent>
                      <div className="space-y-4">
                        {visits.slice(0, 6).map((visit) => (
                          <div key={visit.id} className="flex items-center gap-4 group cursor-default">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                               <span className="text-xs font-bold text-primary">{visit.userName.charAt(0)}</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm truncate">{visit.userName}</span>
                                <span className="text-[10px] text-muted-foreground font-medium">
                                  {new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{visit.department}</p>
                            </div>
                          </div>
                        ))}
                        {visits.length === 0 && (
                          <div className="text-center py-12">
                             <LayoutDashboard className="h-12 w-12 text-muted/30 mx-auto mb-3" />
                             <p className="text-sm text-muted-foreground">No recent check-ins.</p>
                          </div>
                        )}
                      </div>
                      {visits.length > 6 && (
                        <Button variant="ghost" className="w-full mt-6 text-xs" onClick={() => setActiveTab('users')}>
                          View All Activity
                        </Button>
                      )}
                   </CardContent>
                </Card>
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
