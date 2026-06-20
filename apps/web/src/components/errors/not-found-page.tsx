'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { RoadGuardLogo } from '@/components/brand/road-guard-logo';
import { useSelector } from 'react-redux';
import { getDashboardPathForRole, routes } from '@roadguard/config';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { selectAuthUser, selectIsAuthenticated } from '@/store/auth.selectors';

export function NotFoundPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);

  const homeHref = isAuthenticated && user
    ? getDashboardPathForRole(user.role)
    : routes.auth.login;

  const homeLabel = isAuthenticated ? 'Go to dashboard' : 'Sign in';

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-navy/5 via-background to-brand-orange/10 px-4 py-12 dark:from-brand-navy dark:via-brand-navy/90 dark:to-brand-orange/10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex w-full max-w-lg flex-col items-center text-center"
      >
        <div className="mb-6">
          <RoadGuardLogo size="xl" priority />
        </div>

        <p className="text-7xl font-bold tracking-tighter text-primary/20 sm:text-8xl">404</p>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          Page not found
        </h1>

        <p className="mt-3 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Check the URL or head back to a safe route.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="gap-2">
            <Link href={homeHref}>
              <Home className="h-4 w-4" />
              {homeLabel}
            </Link>
          </Button>
          <Button type="button" variant="outline" className="gap-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
