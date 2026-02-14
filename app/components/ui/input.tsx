import { cn } from '@/lib/utils';
import { Input as InputBaseUI } from '@base-ui/react';
import type { ComponentPropsWithoutRef } from 'react';

type Props = ComponentPropsWithoutRef<typeof InputBaseUI>;

function Input({ className, ...props }: Props) {
  return (
    <InputBaseUI
      className={cn(
        'rounded-xl border border-pine-70 px-4 py-2.5 text-pine-950',
        'data-invalid:text-scarlet-700/80 focus:border-pine-200 hover:border-pine-200 focus:data-invalid:border-scarlet-700/50 data-invalid:border-scarlet-700/30 transition-colors',
        className,
      )}
      {...props}
    />
  );
}

export default Input;
