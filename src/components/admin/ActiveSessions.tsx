
"use client"

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, orderBy } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { Monitor, Clock, Users } from 'lucide-react'

export function ActiveSessions() {
  const db = useFirestore()

  const sessionsQuery = useMemoFirebase(() => {
    return query(collection(db, 'active_sessions'), orderBy('lastSeen', 'desc'))
  }, [db])

  const { data: sessions, isLoading } = useCollection(sessionsQuery)

  return (
    <Card className="border-none shadow-sm ring-1 ring-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2 text-black">
            <Monitor className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-black/60">
            Real-time User Monitoring
          </CardDescription>
        </div>
        <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          {sessions?.length || 0} Live
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <span className="text-sm font-bold uppercase tracking-widest animate-pulse">Synchronizing...</span>
            </div>
          ) : sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between group p-4 border border-black/5 hover:bg-black/5 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border-2 border-black/10">
                    <AvatarFallback className="bg-black text-white text-xs font-black">
                      {session.userName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-black uppercase tracking-tight text-black">{session.userName}</span>
                    <span className="text-[10px] font-bold text-black/50">{session.email}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="rounded-none border-black text-[10px] font-black uppercase py-0 px-2 h-5">
                    {session.role || 'Visitor'}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-black/40 uppercase">
                    <Clock className="h-3 w-3" />
                    Active {formatDistanceToNow(new Date(session.lastSeen))} ago
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <Users className="h-12 w-12 text-black/10" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">No Active Sessions Detected</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
