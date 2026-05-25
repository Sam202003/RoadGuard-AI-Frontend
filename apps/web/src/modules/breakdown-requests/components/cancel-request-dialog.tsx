'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  cancelBreakdownSchema,
  type CancelBreakdownFormValues,
} from '../validations/breakdown.schema';

interface CancelRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (values: CancelBreakdownFormValues) => Promise<void>;
  isLoading: boolean;
}

export function CancelRequestDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: CancelRequestDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelBreakdownFormValues>({
    resolver: zodResolver(cancelBreakdownSchema),
    defaultValues: { cancellationReason: '' },
  });

  const onSubmit = async (values: CancelBreakdownFormValues) => {
    await onConfirm(values);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel request</DialogTitle>
          <DialogDescription>
            Tell us why you are cancelling. This helps us improve our service.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cancellationReason">Reason</Label>
            <Textarea
              id="cancellationReason"
              rows={3}
              placeholder="e.g. Issue resolved on my own"
              {...register('cancellationReason')}
            />
            {errors.cancellationReason && (
              <p className="text-sm text-destructive">{errors.cancellationReason.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Keep request
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cancelling…
                </>
              ) : (
                'Cancel request'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
