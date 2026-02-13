import { cn } from '@/lib/utils';
import { Input as InputBaseUI } from '@base-ui/react';

type Props = {
  className?: string;
  placeholder?: string;
};
function Input({ className, placeholder }: Props) {
  return (
    <InputBaseUI
      className={cn(
        'rounded-xl border border-pine-70 px-4 py-2.5 text-pine-950',
        className,
      )}
      placeholder={placeholder || ''}
    />
  );
}

export default Input;
