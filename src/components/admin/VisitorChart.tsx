"use client"

import { useMemo } from "react"
import { VisitRecord } from "@/lib/store"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { format, subDays, startOfDay, isSameDay } from "date-fns"

interface VisitorChartProps {
  visits: VisitRecord[]
}

export function VisitorChart({ visits }: VisitorChartProps) {
  const chartData = useMemo(() => {
    // Get last 7 days
    const days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i))
    
    return days.map(day => {
      const count = visits.filter(v => isSameDay(new Date(v.timestamp), day)).length
      return {
        date: format(day, "MMM dd"),
        visitors: count,
      }
    })
  }, [visits])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="visitors"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorVisitors)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}