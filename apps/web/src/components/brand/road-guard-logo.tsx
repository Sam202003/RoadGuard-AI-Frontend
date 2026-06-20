import Image from 'next/image';
import { cn } from '@/lib/utils';

const LOGO_SRC = '/images/roadguardlogo.png';

const sizeClasses = {
  sm: 'h-8 w-auto',
  md: 'h-10 w-auto',
  lg: 'h-14 w-auto',
  xl: 'h-20 w-auto',
} as const;

interface RoadGuardLogoProps {
  size?: keyof typeof sizeClasses;
  className?: string;
  priority?: boolean;
}

export function RoadGuardLogo({ size = 'md', className, priority = false }: RoadGuardLogoProps) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Road Guard"
      width={160}
      height={64}
      priority={priority}
      className={cn('object-contain', sizeClasses[size], className)}
    />
  );
}
