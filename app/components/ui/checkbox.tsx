import { Checkbox as CheckboxBaseUI } from '@base-ui/react';

type Props = {
  label: string;
};
function Checkbox({ label }: Props) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-pine-950 cursor-pointer">
      <CheckboxBaseUI.Root className="border border-pine-70 w-6 h-6 rounded-md flex items-center justify-center">
        <CheckboxBaseUI.Indicator className="bg-pine-950 block w-3 h-3 rounded-full"></CheckboxBaseUI.Indicator>
      </CheckboxBaseUI.Root>
      {label}
    </label>
  );
}

export default Checkbox;
