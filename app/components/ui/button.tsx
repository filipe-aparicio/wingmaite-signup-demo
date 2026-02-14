'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Button as ButtonBaseUI } from '@base-ui/react';
import Link, { type LinkProps } from 'next/link';
import { cn } from '@/lib/utils';

type CommonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'ghost';
  fullWidth?: boolean;
  className?: string;
};

type ButtonOnlyProps = CommonProps &
  Omit<
    ComponentPropsWithoutRef<typeof ButtonBaseUI>,
    'className' | 'children'
  > & {
    href?: never;
  };

type LinkOnlyProps = CommonProps &
  Omit<
    ComponentPropsWithoutRef<typeof Link>,
    'className' | 'children' | 'href'
  > & {
    href: LinkProps['href'];
  };

type Props = ButtonOnlyProps | LinkOnlyProps;

function getClasses({
  variant,
  fullWidth = false,
  className,
}: Pick<CommonProps, 'variant' | 'fullWidth' | 'className'>) {
  return cn(
    'flex items-center justify-center gap-5 rounded-xl px-5 py-2.5 font-medium border cursor-pointer',
    'px-5 py-2.5 gap-2',
    fullWidth ? 'w-full' : 'w-fit',
    variant === 'primary' && 'bg-pine-900 text-white border-pine-900',
    variant === 'secondary' && 'bg-pine-10 text-pine-900 border-pine-200',
    variant === 'success' && 'bg-moss-200 text-moss-900 border-moss-200',
    variant === 'ghost' &&
      'bg-transparent text-pine-950 border-pine-70  hover:border-pine-200',
    'hover:opacity-80 focus:opacity-80 transition-all',
    className,
  );
}

function Button(props: Props) {
  if ('href' in props && props.href !== undefined) {
    const {
      children,
      variant,
      fullWidth,
      size,
      className,
      href,
      ...linkProps
    } = props;
    const classes = getClasses({ variant, fullWidth, size, className });

    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { children, variant, fullWidth, size, className, ...buttonProps } =
    props;
  const classes = getClasses({ variant, fullWidth, size, className });

  return (
    <ButtonBaseUI className={classes} {...buttonProps}>
      {children}
    </ButtonBaseUI>
  );
}

export default Button;
