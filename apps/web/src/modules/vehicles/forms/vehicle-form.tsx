'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FuelType, TransmissionType, VehicleType } from '../constants/vehicle.enums';
import {
  fuelTypeOptions,
  transmissionTypeOptions,
  vehicleTypeOptions,
} from '../constants/vehicle-labels';
import { vehicleFormSchema, type VehicleFormValues } from '../validations/vehicle.schema';

interface VehicleFormProps {
  defaultValues?: Partial<VehicleFormValues>;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  submitLabel: string;
  isSubmitting?: boolean;
}

const emptyDefaults: VehicleFormValues = {
  vehicleType: VehicleType.CAR,
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  registrationNumber: '',
  fuelType: FuelType.PETROL,
  transmissionType: TransmissionType.MANUAL,
  color: '',
  insuranceExpiryDate: '',
  pollutionExpiryDate: '',
  serviceDueDate: '',
  isPrimaryVehicle: false,
};

export function VehicleForm({
  defaultValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: { ...emptyDefaults, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label>Vehicle type</Label>
          <Controller
            name="vehicleType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.vehicleType && (
            <p className="text-sm text-destructive">{errors.vehicleType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" {...register('brand')} placeholder="e.g. Toyota" />
          {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" {...register('model')} placeholder="e.g. Camry" />
          {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input id="year" type="number" {...register('year')} />
          {errors.year && <p className="text-sm text-destructive">{errors.year.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="registrationNumber">Registration number</Label>
          <Input
            id="registrationNumber"
            {...register('registrationNumber')}
            placeholder="e.g. MH12AB1234"
            className="uppercase"
          />
          {errors.registrationNumber && (
            <p className="text-sm text-destructive">{errors.registrationNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Fuel type</Label>
          <Controller
            name="fuelType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.fuelType && (
            <p className="text-sm text-destructive">{errors.fuelType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Transmission</Label>
          <Controller
            name="transmissionType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {transmissionTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.transmissionType && (
            <p className="text-sm text-destructive">{errors.transmissionType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color (optional)</Label>
          <Input id="color" {...register('color')} placeholder="e.g. Silver" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="insuranceExpiryDate">Insurance expiry</Label>
          <Input id="insuranceExpiryDate" type="date" {...register('insuranceExpiryDate')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pollutionExpiryDate">Pollution expiry</Label>
          <Input id="pollutionExpiryDate" type="date" {...register('pollutionExpiryDate')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceDueDate">Service due</Label>
          <Input id="serviceDueDate" type="date" {...register('serviceDueDate')} />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-input accent-primary"
          {...register('isPrimaryVehicle')}
        />
        <span className="text-sm font-medium">Set as primary vehicle</span>
      </label>

      <Button type="submit" disabled={isSubmitting} className="gap-2">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
