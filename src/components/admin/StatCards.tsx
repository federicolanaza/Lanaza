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
      title: "Today's Visitors",
      value: dailyCount,
      icon: Clock,
      description: "Since midnight",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "This Week",
      value: weeklyCount,
      icon: Calendar,
      description: "From Monday",
      color: "text-violet-600",
      bg: "bg-violet-50"
    },
    {
      title: "This Month",
      value: monthlyCount,
      icon: TrendingUp,
      description: "Monthly total",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      title: "Total Visits",
      value: totalCount,
      icon: Users,
      description: "All-time records",
      color: "text-primary",
      bg: "bg-primary/10"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`rounded-lg p-2 ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
