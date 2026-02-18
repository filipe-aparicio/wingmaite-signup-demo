import { Checkbox as CheckboxBaseUI } from "@base-ui/react";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = Omit<
  ComponentPropsWithoutRef<typeof CheckboxBaseUI.Root>,
  "children"
> & {
  label: ReactNode;
  className?: string;
};

function Checkbox({ label, className, ...props }: Props) {
  return (
    <label className="text-pine-950 group flex cursor-pointer items-center gap-2.5 text-sm">
      <CheckboxBaseUI.Root
        className={cn(
          "border-pine-70 focus:border-pine-200 group-hover:border-pine-200 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors",
          className,
        )}
        {...props}
      >
        <CheckboxBaseUI.Indicator className="bg-pine-950 block h-3 w-3 rounded-full transition-all data-ending-style:h-0 data-ending-style:w-0 data-starting-style:h-0 data-starting-style:w-0"></CheckboxBaseUI.Indicator>
      </CheckboxBaseUI.Root>
      {label}
    </label>
  );
}

export default Checkbox;
