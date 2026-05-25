'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 flex items-center gap-2 text-primary"
      >
        <Shield className="h-8 w-8" />
        <span className="text-2xl font-bold tracking-tight">Road Guard</span>
      </motion.div>

      <Card className="w-full max-w-md border-border/60 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
