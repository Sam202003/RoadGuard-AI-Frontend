'use client';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getErrorMessage } from '@/lib/get-error-message';
import { useUpdateAvailabilityMutation } from '@/store/api/provider.api';
import { AvailabilityStatus, OnlineStatus } from '../constants/provider.enums';
import { availabilityLabels, onlineStatusLabels } from '../constants/provider-labels';
import type { ProviderProfile } from '../types/provider.types';

interface ProviderStatusTogglesProps {
  provider: ProviderProfile;
}

export function ProviderStatusToggles({ provider }: ProviderStatusTogglesProps) {
  const [updateAvailability, { isLoading }] = useUpdateAvailabilityMutation();

  const handleAvailabilityChange = async (value: AvailabilityStatus) => {
    try {
      await updateAvailability({ availabilityStatus: value }).unwrap();
      toast.success('Availability updated');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update availability'));
    }
  };

  const handleOnlineToggle = async (checked: boolean) => {
    try {
      await updateAvailability({
        onlineStatus: checked ? OnlineStatus.ONLINE : OnlineStatus.OFFLINE,
      }).unwrap();
      toast.success(checked ? 'You are now online' : 'You are now offline');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update online status'));
    }
  };

  return (
    <Card className="border-border/60 bg-card/70 p-5 backdrop-blur-sm">
      <h3 className="font-semibold">Dispatch status</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Control whether you receive new breakdown assignments.
      </p>

      <div className="mt-5 space-y-5">
        <div className="space-y-2">
          <Label>Availability</Label>
          <Select
            value={provider.availabilityStatus}
            onValueChange={(v) => handleAvailabilityChange(v as AvailabilityStatus)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(AvailabilityStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {availabilityLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
          <div>
            <p className="font-medium">{onlineStatusLabels[provider.onlineStatus]}</p>
            <p className="text-xs text-muted-foreground">
              Go online to appear in provider matching
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={provider.onlineStatus === OnlineStatus.ONLINE}
              disabled={isLoading}
              onChange={(e) => handleOnlineToggle(e.target.checked)}
            />
            <span className="h-6 w-11 rounded-full bg-muted transition peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring" />
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow transition peer-checked:translate-x-5" />
            {isLoading && (
              <Loader2 className="absolute -right-8 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </label>
        </div>
      </div>
    </Card>
  );
}
