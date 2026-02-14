'use client';

import Logo from '@/app/components/brand/logo';
import StarlingFlow from '@/app/components/brand/starling-flow';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const FINISH_ROUTE = '/signup/finish';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isFinishRoute = pathname === FINISH_ROUTE;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isFinishRoute) return;

    const timerId = window.setTimeout(() => {
      setIsLoaded(true);
    }, 4000);

    return () => {
      window.clearTimeout(timerId);
      setIsLoaded(false);
    };
  }, [isFinishRoute]);

  return (
    <div className="h-dvh w-dvw flex flex-col md:flex-row">
      <div
        id="starling-flow"
        className={cn(
          'bg-pine-50 md:h-full transition-all duration-1500 ease-in-out flex items-end justify-center',
          isFinishRoute ? 'md:w-full h-full md:h-auto' : 'md:w-1/2',
        )}
      >
        <div
          className={cn(
            'min-h-40 md:min-h-auto overflow-hidden transition-all duration-1000 delay-500 ease-[cubic-bezier(0.33, 1, 0.68, 1)] relative flex items-center justify-center',
            isLoaded
              ? 'w-12 h-12 rounded-[500px] mb-10 min-h-auto'
              : 'w-full h-full rounded-none mb-0',
          )}
        >
          <Logo
            className={cn(
              'transition-all duration-300 ease-in-out z-5 md:h-10 h-8',
              isLoaded ? 'opacity-0 scale-50' : 'opacity-100 scale-100',
            )}
          />
          <StarlingFlow
            className="absolute"
            speed={isFinishRoute ? 0.2 : 0.1}
            softNoiseSpeed={isFinishRoute ? 0.2 : 0.1}
            waveSpeed={isFinishRoute ? 0.2 : 0.1}
            softness={40}
          />
        </div>
      </div>

      <div
        id="sidebar"
        className={cn(
          'bg-white md:w-1/2 h-full transition-all duration-700 ease-in-out',
          isFinishRoute
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
