"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { StatCards } from '@/components/admin/StatCards'
import { UserTable } from '@/components/admin/UserTable'
import { AiTrends } from '@/components/admin/AiTrends'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  LogOut, 
  Bell,
  Search as SearchIcon,
  Settings
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function AdminPage() {
  const { currentUser, logout, visits } = useStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')

  useEffect(() => {
    if (currentUser?.role !== 'Admin') {
      router.push('/')
    }
  }, [currentUser, router])

  if (currentUser?.role !== 'Admin') return null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white p-0.5 shadow-sm">
            <Image 
              src={logo?.imageUrl || ''} 
              alt="NEU Logo" 
              fill 
              className="object-contain"
              data-ai-hint={logo?.imageHint}
            />
          </div>
          <span className="font-headline text-lg font-bold text-sidebar-foreground tracking-tight">LibreConnect</span>
        </div>
        
        <div className="flex-1 space-y-1 p-4">
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${activeTab === 'overview' ? 'bg-sidebar-accent' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard className="mr-3 h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${activeTab === 'users' ? 'bg-sidebar-accent' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users className="mr-3 h-4 w-4" />
            User Management
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${activeTab === 'trends' ? 'bg-sidebar-accent' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            <Sparkles className="mr-3 h-4 w-4" />
            AI Trends
          </Button>
        </div>

        <div className="border-t border-sidebar-border p-4 space-y-2">
          <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-sidebar-accent/50">
            <Avatar className="h-8 w-8 border border-sidebar-border">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold truncate">{currentUser.name}</span>
              <span className="text-[10px] opacity-70 truncate">{currentUser.email}</span>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-9" onClick={handleLogout}>
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative max-w-md w-full hidden sm:block">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search reports..." className="pl-9 bg-muted/30 border-none h-9 text-sm focus-visible:ring-primary/20" />
             </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-headline text-3xl font-bold text-foreground">
                {activeTab === 'overview' && 'Library Statistics'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'trends' && 'AI Trend Analysis'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {activeTab === 'overview' && 'Real-time overview of library facility usage.'}
                {activeTab === 'users' && 'Manage student access and institutional roles.'}
                {activeTab === 'trends' && 'Advanced insights generated from historical check-ins.'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-9">Export PDF</Button>
              <Button size="sm" className="h-9 bg-primary">Share Report</Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Mobile Tab Trigger Bar */}
            <TabsList className="md:hidden grid grid-cols-3 mb-6 bg-muted/30 p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="trends">AI</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 mt-0 border-none p-0 outline-none">
              <StatCards visits={visits} />
              
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-none shadow-sm">
                   <CardHeader>
                     <CardTitle className="text-lg">Recent Visits</CardTitle>
                     <CardDescription>Latest {Math.min(visits.length, 5)} visitor check-ins recorded.</CardDescription>
                   </CardHeader>
                   <CardContent>
                      <div className="space-y-4">
                        {visits.slice(0, 5).map((visit) => (
                          <div key={visit.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-transparent hover:border-muted-foreground/10 transition-colors">
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{visit.userName}</span>
                              <span className="text-xs text-muted-foreground">{visit.department} • {visit.reasonForVisit}</span>
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}
                        {visits.length === 0 && (
                          <p className="text-center py-10 text-muted-foreground text-sm italic">No visits recorded yet.</p>
                        )}
                      </div>
                   </CardContent>
                </Card>

                <Card className="border-none shadow-sm h-fit">
                   <CardHeader>
                     <CardTitle className="text-lg">Activity Summary</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-primary/5 text-center">
                          <span className="block text-2xl font-bold text-primary">{visits.length}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total Sessions</span>
                        </div>
                        <div className="p-4 rounded-xl bg-accent/5 text-center">
                          <span className="block text-2xl font-bold text-accent">
                            {new Set(visits.map(v => v.userEmail)).size}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Unique Users</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">TOP REASONS</p>
                        {Array.from(new Set(visits.map(v => v.reasonForVisit.split(',')[0])))
                          .slice(0, 3)
                          .map((r, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="truncate mr-2">{r}</span>
                            <span className="font-bold">{visits.filter(v => v.reasonForVisit.includes(r)).length}</span>
                          </div>
                        ))}
                      </div>
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
    </div>
  )
}