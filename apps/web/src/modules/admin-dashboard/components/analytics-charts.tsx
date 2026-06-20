'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { statusLabels } from '@/modules/breakdown-requests/constants/breakdown-labels';
import type { AdminAnalytics } from '../types/admin.types';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2, 142 76% 36%))',
  'hsl(var(--chart-3, 38 92% 50%))',
  'hsl(var(--chart-4, 262 83% 58%))',
  'hsl(var(--chart-5, 0 84% 60%))',
  'hsl(var(--muted-foreground))',
  'hsl(var(--secondary-foreground))',
  'hsl(var(--accent-foreground))',
];

interface AnalyticsChartsProps {
  analytics?: AdminAnalytics;
  isLoading?: boolean;
}

export function AnalyticsCharts({ analytics, isLoading }: AnalyticsChartsProps) {
  if (isLoading || !analytics) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/60 bg-card/60">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statusData = analytics.requestsByStatus
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: statusLabels[item.status],
      value: item.count,
    }));

  const dayData = analytics.requestsPerDay.map((item) => ({
    date: item.date.slice(5),
    count: item.count,
  }));

  const providerData = analytics.providerActivity;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base">Requests by status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base">Requests per day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base">Provider activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={providerData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="providerName"
                  width={120}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="completedCount" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base">Emergency requests</CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 flex-col items-center justify-center">
          <p className="text-5xl font-bold tabular-nums text-destructive">
            {analytics.emergencyRequestCount}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Total emergency-priority breakdown requests
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
