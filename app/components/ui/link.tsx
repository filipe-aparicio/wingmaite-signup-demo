import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export type LinkProps = ComponentProps<typeof NextLink>;

function Link({ className, children, ...props }: LinkProps) {
  return (
    <NextLink {...props} className={cn('text-pine-950 underline', className)}>
      {children}
    </NextLink>
  );
}

export default Link;
