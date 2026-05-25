'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { routes, getCustomerBreakdownDetailPath } from '@roadguard/config';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getErrorMessage } from '@/lib/get-error-message';
import { useCreateBreakdownRequestMutation } from '@/store/api/breakdown.api';
import { BreakdownRequestForm } from '../forms/breakdown-request-form';
import {
  formValuesToCreatePayload,
  type BreakdownRequestFormValues,
} from '../validations/breakdown.schema';

export function NewBreakdownPage() {
  const router = useRouter();
  const [createRequest, { isLoading }] = useCreateBreakdownRequestMutation();

  const onSubmit = async (values: BreakdownRequestFormValues) => {
    try {
      const request = await createRequest(formValuesToCreatePayload(values)).unwrap();
      toast.success('Assistance request submitted');
      router.push(getCustomerBreakdownDetailPath(request.id));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to submit request'));
    }
  };

  return (
    <DashboardContent>
      <Button variant="ghost" size="sm" className="mb-2 -ml-2 w-fit gap-1" asChild>
        <Link href={routes.customer.breakdown}>
          <ArrowLeft className="h-4 w-4" />
          Back to requests
        </Link>
      </Button>
      <DashboardPageHeader
        title="Request assistance"
        description="Tell us what happened and where you are. We will match you with the nearest provider."
      />
      <Card className="mt-6 max-w-3xl border-border/60 bg-card/70 p-6 backdrop-blur-sm">
        <BreakdownRequestForm onSubmit={onSubmit} isSubmitting={isLoading} />
      </Card>
    </DashboardContent>
  );
}
