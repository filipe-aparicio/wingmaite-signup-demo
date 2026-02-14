'use client';

import { Toast } from '@base-ui/react/toast';
import { AlertCircle, MailCheck, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Progress from '@/app/components/ui/progress';

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts
    .filter(t => !t.limited)
    .map(toast => {
      return (
        <Toast.Root
          key={toast.id}
          toast={toast}
          tabIndex={-1}
          className={cn(
            'relative rounded-[27.5px] border-t border-white/40 bg-pine-100/40 pointer-events-auto py-4 px-6 backdrop-blur-xl shadow-[0px_4px_4px] shadow-saffron-900/10 max-w-md w-full',
            'transition data-starting-style:translate-y-2 data-starting-style:opacity-0 data-ending-style:translate-y-2 data-ending-style:opacity-0',
          )}
        >
          <Toast.Content className="flex flex-col items-center justify-center gap-2.5 w-full">
            <div className="flex items-center justify-between gap-2.5 w-full">
              <div className="flex items-center justify-center gap-2.5">
                {toast.type === 'working' && <Wand2 size={16} />}
                {toast.type === 'alert' && <AlertCircle size={16} />}
                {toast.type === 'email' && <MailCheck size={16} />}
                <Toast.Title className="leading-tight mb-0.5" />
              </div>
              <Progress value={100} timeout={toast.timeout} />
            </div>
            <Toast.Description className="mt-1 text-sm leading-5 text-pine-700" />
          </Toast.Content>
        </Toast.Root>
      );
    });
}

export default ToastList;
