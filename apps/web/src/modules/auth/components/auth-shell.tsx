'use client';

import { motion } from 'framer-motion';
import { RoadGuardLogo } from '@/components/brand/road-guard-logo';
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
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-navy/5 via-background to-brand-orange/10 px-4 py-12 dark:from-brand-navy dark:via-brand-navy/90 dark:to-brand-orange/10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <RoadGuardLogo size="xl" priority />
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
