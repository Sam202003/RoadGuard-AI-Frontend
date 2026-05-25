'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { IssueTypeCards } from '../components/issue-type-cards';
import { LocationSelector } from '../components/location-selector';
import { VehicleSelector } from '../components/vehicle-selector';
import { IssueType } from '../constants/breakdown.enums';
import {
  breakdownRequestFormSchema,
  type BreakdownRequestFormValues,
} from '../validations/breakdown.schema';

interface BreakdownRequestFormProps {
  onSubmit: (values: BreakdownRequestFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function BreakdownRequestForm({ onSubmit, isSubmitting }: BreakdownRequestFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BreakdownRequestFormValues>({
    resolver: zodResolver(breakdownRequestFormSchema),
    defaultValues: {
      vehicleId: '',
      issueType: undefined as unknown as BreakdownRequestFormValues['issueType'],
      issueDescription: '',
      isEmergency: false,
      latitude: undefined as unknown as number,
      longitude: undefined as unknown as number,
    },
  });

  const isEmergency = watch('isEmergency');
  const issueType = watch('issueType');
  const latitude = watch('latitude');
  const longitude = watch('longitude');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-3">
        <Label className="text-base">Select vehicle</Label>
        <Controller
          name="vehicleId"
          control={control}
          render={({ field }) => (
            <VehicleSelector
              value={field.value}
              onChange={field.onChange}
              error={errors.vehicleId?.message}
            />
          )}
        />
      </section>

      <section className="space-y-3">
        <Label className="text-base">What happened?</Label>
        <Controller
          name="issueType"
          control={control}
          render={({ field }) => (
            <IssueTypeCards
              value={field.value}
              onChange={(type) => {
                field.onChange(type);
                if (type === IssueType.ACCIDENT) {
                  setValue('isEmergency', true);
                }
              }}
              error={errors.issueType?.message}
            />
          )}
        />
      </section>

      <section className="space-y-3">
        <Label htmlFor="issueDescription" className="text-base">
          Describe the issue
        </Label>
        <Textarea
          id="issueDescription"
          rows={4}
          placeholder="Describe what happened, your location context, and any safety concerns…"
          {...register('issueDescription')}
        />
        {errors.issueDescription && (
          <p className="text-sm text-destructive">{errors.issueDescription.message}</p>
        )}
      </section>

      <section
        className={cn(
          'rounded-xl border p-4 transition-colors',
          isEmergency
            ? 'border-destructive/50 bg-destructive/10'
            : 'border-border/60 bg-card/40',
        )}
      >
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-destructive"
            {...register('isEmergency')}
          />
          <div>
            <span className="flex items-center gap-2 font-semibold text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Emergency request
            </span>
            <p className="mt-1 text-sm text-muted-foreground">
              Marks this as highest priority. Use for accidents or immediate danger.
              {issueType === IssueType.ACCIDENT && ' Auto-enabled for accidents.'}
            </p>
          </div>
        </label>
      </section>

      <section className="space-y-3">
        <Label className="text-base">Your location</Label>
        <LocationSelector
          latitude={latitude}
          longitude={longitude}
          onLatitudeChange={(v) => setValue('latitude', v as number, { shouldValidate: true })}
          onLongitudeChange={(v) => setValue('longitude', v as number, { shouldValidate: true })}
          latError={errors.latitude?.message}
          lonError={errors.longitude?.message}
        />
      </section>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className={cn(
          'w-full gap-2 sm:w-auto',
          isEmergency && 'bg-destructive hover:bg-destructive/90',
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            {isEmergency && <AlertTriangle className="h-4 w-4" />}
            Request assistance
          </>
        )}
      </Button>
    </form>
  );
}
