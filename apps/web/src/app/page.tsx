import { redirect } from 'next/navigation';
import { routes } from '@roadguard/config';

export default function HomePage() {
  redirect(routes.auth.login);
}
