'use server';
/**
 * @fileOverview An AI agent for analyzing historical library visitor data.
 *
 * - adminVisitorTrendAnalysis - A function that handles the analysis of visitor data.
 * - AdminVisitorTrendAnalysisInput - The input type for the adminVisitorTrendAnalysis function.
 * - AdminVisitorTrendAnalysisOutput - The return type for the adminVisitorTrendAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VisitRecordSchema = z.object({
  timestamp: z.string().datetime().describe('Timestamp of the visit in ISO 8601 format.'),
  userEmail: z.string().email().describe('Email of the visitor.'),
  department: z.string().describe('College department of the visitor.'),
  reasonForVisit: z.string().describe('Reason for the visit.'),
});

const AdminVisitorTrendAnalysisInputSchema = z.object({
  visitorData: z.array(VisitRecordSchema).describe('Historical library visitor check-in data.'),
});
export type AdminVisitorTrendAnalysisInput = z.infer<typeof AdminVisitorTrendAnalysisInputSchema>;

const AdminVisitorTrendAnalysisOutputSchema = z.object({
  overallSummary: z.string().describe('An overall summary of the visitor trends.'),
  topDepartments: z.array(z.object({
    department: z.string(),
    count: z.number(),
  })).describe('List of top departments by visitor count.'),
  commonReasons: z.array(z.object({
    reason: z.string(),
    count: z.number(),
  })).describe('List of most common reasons for visits.'),
  peakHours: z.array(z.string()).describe('List of time ranges or specific hours representing peak visiting times (e.g., "10:00-12:00", "Afternoons").'),
  insights: z.array(z.string()).describe('Key insights derived from the visitor data, such as patterns or correlations.'),
  recommendations: z.array(z.string()).describe('Actionable recommendations for library operations based on the analysis.'),
});
export type AdminVisitorTrendAnalysisOutput = z.infer<typeof AdminVisitorTrendAnalysisOutputSchema>;

export async function adminVisitorTrendAnalysis(input: AdminVisitorTrendAnalysisInput): Promise<AdminVisitorTrendAnalysisOutput> {
  return adminVisitorTrendAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminVisitorTrendAnalysisPrompt',
  input: { schema: AdminVisitorTrendAnalysisInputSchema },
  output: { schema: AdminVisitorTrendAnalysisOutputSchema },
  prompt: `You are an AI assistant specialized in analyzing library visitor data and generating insightful reports.
Your goal is to help library administrators understand visitor behavior, identify trends, and make informed decisions.

Analyze the following historical library visitor check-in data and provide a comprehensive report including an overall summary, top visiting departments, common reasons for visits, peak hours, key insights, and actionable recommendations.

Visitor Data:
\`\`\`json
{{{JSON.stringify visitorData}}}
\`\`\`

Based on this data, provide your analysis in JSON format adhering to the following structure:
{{output.schema}}`,
});

const adminVisitorTrendAnalysisFlow = ai.defineFlow(
  {
    name: 'adminVisitorTrendAnalysisFlow',
    inputSchema: AdminVisitorTrendAnalysisInputSchema,
    outputSchema: AdminVisitorTrendAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
