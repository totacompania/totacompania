'use client';

import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col min-h-screen text-white overflow-hidden',
        className
      )}
      style={{ backgroundColor: 'var(--brand-violet)' }}
      {...props}
    >
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

// Version hero avec couleur violet unie
export function AuroraHero({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn('relative min-h-screen flex flex-col justify-center overflow-hidden', className)}
      style={{ backgroundColor: 'var(--brand-violet)' }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
