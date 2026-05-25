'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Car, Plus } from 'lucide-react';
import { routes } from '@roadguard/config';
import { Button } from '@/components/ui/button';

export function VehicleEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center backdrop-blur-sm"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Car className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">No vehicles yet</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Add your first vehicle to request roadside assistance faster and keep service dates
        organized.
      </p>
      <Button asChild className="mt-6 gap-2">
        <Link href={routes.customer.vehiclesAdd}>
          <Plus className="h-4 w-4" />
          Add vehicle
        </Link>
      </Button>
    </motion.div>
  );
}
