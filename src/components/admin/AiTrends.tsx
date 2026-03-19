"use client"

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { adminVisitorTrendAnalysis, AdminVisitorTrendAnalysisOutput } from '@/ai/flows/admin-visitor-trend-analysis'
import { Sparkles, Loader2, BarChart3, Clock, Lightbulb, ListChecks } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function AiTrends() {
  const { visits } = useStore()
  const [analysis, setAnalysis] = useState<AdminVisitorTrendAnalysisOutput | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleRunAnalysis = async () => {
    if (visits.length === 0) return
    
    setIsAnalyzing(true)
    try {
      const result = await adminVisitorTrendAnalysis({ visitorData: visits })
      setAnalysis(result)
    } catch (error) {
      console.error("AI Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AI Visitor Insights
              </CardTitle>
              <CardDescription>
                Generate intelligent summaries and patterns from your library check-in history.
              </CardDescription>
            </div>
            <Button 
              onClick={handleRunAnalysis} 
              disabled={isAnalyzing || visits.length === 0}
              className="bg-accent hover:bg-accent/90"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Data...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {analysis && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-none shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{analysis.overallSummary}</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Top Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.topDepartments.map((dept, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{dept.department}</span>
                    <Badge variant="secondary" className="font-mono">{dept.count} visits</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Peak Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.peakHours.map((hour, i) => (
                  <Badge key={i} variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                    {hour}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base">Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.insights.map((insight, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2">
              <ListChecks className="h-4 w-4 text-green-600" />
              <CardTitle className="text-base">Actionable Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {visits.length === 0 && !isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
          <BarChart3 className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No data available for analysis</h3>
          <p className="text-sm text-muted-foreground/60">Insights will appear here once visitors start checking in.</p>
        </div>
      )}
    </div>
  )
}
