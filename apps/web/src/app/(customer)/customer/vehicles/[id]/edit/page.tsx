import { EditVehiclePage } from '@/modules/vehicles';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerEditVehiclePage({ params }: PageProps) {
  const { id } = await params;
  return <EditVehiclePage vehicleId={id} />;
}
