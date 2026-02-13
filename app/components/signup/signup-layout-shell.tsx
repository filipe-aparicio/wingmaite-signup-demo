'use client';

import Logo from '@/app/components/brand/logo';
import StarlingFlow from '@/app/components/brand/starling-flow';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

const LOADING_ROUTE = '/signup/loading';

function SignupLayoutShell({ children }: Props) {
  const pathname = usePathname();
  const isLoadingRoute = pathname === LOADING_ROUTE;

  return (
    <div
      className={cn(
        'h-screen w-screen grid grid-cols-1 md:transition-[grid-template-columns] md:duration-700 md:ease-in-out',
        isLoadingRoute
          ? 'md:grid-cols-[minmax(0,1fr)_0fr]'
          : 'md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]',
      )}
    >
      <div
        id="starling-flow"
        className="bg-scarlet-300 relative overflow-hidden min-h-80 md:min-h-0"
      >
        <Logo className="absolute m-auto inset-0" />
        <StarlingFlow
          className="h-full"
          speed={0.1}
          softNoiseSpeed={0.1}
          waveSpeed={0.1}
          softness={40}
        />
      </div>

      <div
        id="sidebar"
        className={cn(
          'bg-white h-full overflow-hidden md:transition-[opacity,padding] md:duration-500',
          isLoadingRoute
            ? 'hidden md:block md:opacity-0 md:pointer-events-none px-0'
            : 'opacity-100 px-5',
        )}
      >
        <div
          className={cn(
            'flex min-h-full items-center w-full justify-center',
            isLoadingRoute && 'invisible',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default SignupLayoutShell;
