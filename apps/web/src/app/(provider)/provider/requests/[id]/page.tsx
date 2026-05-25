import { ProviderRequestDetailPage } from '@/modules/provider-dashboard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProviderRequestDetailRoutePage({ params }: PageProps) {
  const { id } = await params;
  return <ProviderRequestDetailPage requestId={id} />;
}
