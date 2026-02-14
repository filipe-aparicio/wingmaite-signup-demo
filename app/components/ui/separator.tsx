import { cn } from '@/lib/utils';

type props = {
  className?: string;
  label?: string;
};
function Separator({ className, label }: props) {
  return (
    <div
      className={cn(
        'w-full text-center relative',
        'before:content-[""] before:absolute before:h-px before:w-full before:bg-pine-70 before:block before:left-0 before:right-0 before:inset-y-1/2',
        className,
      )}
    >
      {label && <span className="bg-white relative px-4">{label}</span>}
    </div>
  );
}

export default Separator;
