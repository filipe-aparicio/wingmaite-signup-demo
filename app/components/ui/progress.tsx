'use client';
import { Progress as ProgressBaseUI } from '@base-ui/react';
import { useEffect, useState } from 'react';

type Props = {
  value: number;
  timeout?: number;
};
function Progress({ value = 100, timeout = 500 }: Props) {
  const [progressValue, setProgressValue] = useState(0);
  useEffect(() => {
    setProgressValue(value);
  }, [value]);
  return (
    <ProgressBaseUI.Root
      value={timeout ? progressValue : value}
      className="grid grid-cols-2 gap-y-2 w-10"
    >
      <ProgressBaseUI.Track className="col-span-full h-1 overflow-hidden rounded-full bg-white">
        <ProgressBaseUI.Indicator
          className="block bg-pine-950 transition-all ease-linear rounded"
          style={{ transitionDuration: `${timeout}ms` }}
        />
      </ProgressBaseUI.Track>
    </ProgressBaseUI.Root>
  );
}

export default Progress;
