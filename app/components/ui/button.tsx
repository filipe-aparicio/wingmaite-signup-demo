'use client';

import type { ReactNode } from 'react';
import { Button as ButtonBaseUI } from '@base-ui/react';
import Link, { type LinkProps } from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'ghost';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: LinkProps['href'];
  onClick?: () => void;
};

function Button({
  children,
  variant,
  fullWidth = false,
  size = 'lg',
  className,
  href,
  onClick,
}: Props) {
  const classes = cn(
    'flex items-center justify-center gap-5 rounded-xl px-5 py-2.5 font-medium border cursor-pointer',
    fullWidth ? 'w-full' : 'w-fit',
    variant === 'primary' && 'bg-pine-900 text-white border-pine-900',
    variant === 'secondary' && 'bg-pine-10 text-pine-900 border-pine-200',
    variant === 'success' && 'bg-moss-200 text-moss-900 border-moss-200',
    variant === 'ghost' && 'bg-transparent text-pine-950 border-pine-70',
    size === 'sm' && 'px-3 py-1.5 gap-1.5',
    size === 'lg' && 'px-6 py-3 gap-2',
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  } else {
    return (
      <ButtonBaseUI className={classes} onClick={onClick}>
        {children}
      </ButtonBaseUI>
    );
  }
}

export default Button;
