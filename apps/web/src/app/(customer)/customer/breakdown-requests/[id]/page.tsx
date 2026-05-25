import { BreakdownDetailPage } from '@/modules/breakdown-requests';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerBreakdownDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <BreakdownDetailPage requestId={id} />;
}
