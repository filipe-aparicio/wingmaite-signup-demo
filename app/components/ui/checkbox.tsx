import { Checkbox as CheckboxBaseUI } from '@base-ui/react';
import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Props = Omit<
  ComponentPropsWithoutRef<typeof CheckboxBaseUI.Root>,
  'children'
> & {
  label: ReactNode;
  className?: string;
};

function Checkbox({ label, className, ...rootProps }: Props) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-pine-950 cursor-pointer group">
      <CheckboxBaseUI.Root
        className={cn(
          'border border-pine-70 w-6 h-6 rounded-md flex items-center justify-center focus:border-pine-200 group-hover:border-pine-200 transition-colors shrink-0',
          className,
        )}
        {...rootProps}
      >
        <CheckboxBaseUI.Indicator className="bg-pine-950 transition-all data-starting-style:w-0 data-starting-style:h-0 w-3 h-3 data-ending-style:w-0 data-ending-style:h-0 block rounded-full"></CheckboxBaseUI.Indicator>
      </CheckboxBaseUI.Root>
      {label}
    </label>
  );
}

export default Checkbox;
