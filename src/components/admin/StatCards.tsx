"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VisitRecord } from '@/lib/store'
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react'
import { startOfDay, startOfWeek, startOfMonth, isAfter } from 'date-fns'

interface StatCardsProps {
  visits: VisitRecord[]
}

export function StatCards({ visits }: StatCardsProps) {
  const now = new Date()
  
  const dailyCount = visits.filter(v => isAfter(new Date(v.timestamp), startOfDay(now))).length
  const weeklyCount = visits.filter(v => isAfter(new Date(v.timestamp), startOfWeek(now))).length
  const monthlyCount = visits.filter(v => isAfter(new Date(v.timestamp), startOfMonth(now))).length
  const totalCount = visits.length

  const stats = [
    {
      title: "Today",
      value: dailyCount,
      icon: Clock,
      description: "24h Volume",
    },
    {
      title: "Weekly",
      value: weeklyCount,
      icon: Calendar,
      description: "Trailing 7D",
    },
    {
      title: "Monthly",
      value: monthlyCount,
      icon: TrendingUp,
      description: "Current Month",
    },
    {
      title: "Total",
      value: totalCount,
      icon: Users,
      description: "Lifetime",
    }
  ]

  return (
    <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-4 border border-primary/10 overflow-hidden">
      {stats.map((stat, i) => (
        <div key={i} className={`p-8 bg-white transition-all group hover:bg-primary hover:text-white ${i !== stats.length - 1 ? 'lg:border-r border-primary/10' : ''} ${i < 2 ? 'border-b lg:border-b-0 border-primary/10' : ''}`}>
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black group-hover:text-white/70">{stat.title}</span>
            <stat.icon className="h-5 w-5 text-black group-hover:text-white transition-colors" />
          </div>
          <div className="space-y-1">
            <div className="text-5xl font-black tracking-tighter leading-none text-black group-hover:text-white">{stat.value}</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black group-hover:text-white/60">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
