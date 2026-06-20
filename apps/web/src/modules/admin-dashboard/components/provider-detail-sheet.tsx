'use client';

import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getErrorMessage } from '@/lib/get-error-message';
import { useUpdateAdminProviderKycMutation } from '@/store/api/admin.api';
import { KycStatus } from '@/modules/provider-dashboard/constants/provider.enums';
import type { AdminProvider } from '../types/admin.types';
import {
  availabilityLabels,
  onlineStatusLabels,
  providerTypeLabels,
} from '../constants/admin-labels';
import { formatAdminDate, formatCoordinates, formatRating, formatShortId } from '../utils/formatters';

interface ProviderDetailSheetProps {
  provider: AdminProvider | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProviderDetailSheet({ provider, open, onOpenChange }: ProviderDetailSheetProps) {
  const [updateKyc, { isLoading }] = useUpdateAdminProviderKycMutation();

  if (!provider) return null;

  const handleKycUpdate = async (kycStatus: KycStatus) => {
    try {
      await updateKyc({ id: provider.id, kycStatus }).unwrap();
      toast.success(`KYC status updated to ${kycStatus}`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update KYC status'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{provider.businessName}</DialogTitle>
          <DialogDescription>{providerTypeLabels[provider.providerType]}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{availabilityLabels[provider.availabilityStatus]}</Badge>
            <Badge variant={provider.onlineStatus === 'ONLINE' ? 'default' : 'outline'}>
              {onlineStatusLabels[provider.onlineStatus]}
            </Badge>
            <Badge variant="outline">{provider.kycStatus}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              disabled={isLoading || provider.kycStatus === KycStatus.VERIFIED}
              onClick={() => handleKycUpdate(KycStatus.VERIFIED)}
            >
              Approve KYC
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading || provider.kycStatus === KycStatus.REJECTED}
              onClick={() => handleKycUpdate(KycStatus.REJECTED)}
            >
              Reject KYC
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={isLoading || provider.kycStatus === KycStatus.PENDING}
              onClick={() => handleKycUpdate(KycStatus.PENDING)}
            >
              Mark pending
            </Button>
          </div>

          <Separator />

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="break-all">{provider.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{provider.phoneNumber}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Rating</dt>
              <dd>{formatRating(provider.ratings.average, provider.ratings.count)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Completed jobs</dt>
              <dd>{provider.totalCompletedRequests}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Location</dt>
              <dd className="font-mono text-xs">{formatCoordinates(provider.currentLocation)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">User ID</dt>
              <dd className="font-mono text-xs">{formatShortId(provider.userId)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Onboarded</dt>
              <dd>{formatAdminDate(provider.createdAt)}</dd>
            </div>
          </dl>

          {provider.servicesOffered.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium">Service categories</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {provider.servicesOffered.map((service) => (
                    <Badge key={service} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
