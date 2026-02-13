'use client';

import Logo from '@/app/components/brand/logo';
import StarlingFlow from '@/app/components/brand/starling-flow';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

const LOADING_ROUTE = '/signup/loading';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoadingRoute = pathname === LOADING_ROUTE;

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      <div
        id="starling-flow"
        className={cn(
          'bg-scarlet-300 md:h-full relative overflow-hidden transition-all duration-700 ease-in-out',
          isLoadingRoute ? 'md:w-full h-full md:h-auto' : 'md:w-1/2',
        )}
      >
        <Logo className="absolute m-auto inset-0" />
        <StarlingFlow
          className="min-h-80"
          speed={0.1}
          softNoiseSpeed={0.1}
          waveSpeed={0.1}
          softness={40}
        />
      </div>

      <div
        id="sidebar"
        className={cn(
          'bg-white md:w-1/2 h-full transition-all duration-700 ease-in-out',
          isLoadingRoute
            ? 'md:w-0 h-0 px-0 opacity-0 md:h-auto'
            : 'md:w-1/2 px-5 opacity-100',
        )}
      >
        <div className="flex min-h-full items-center w-full justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
