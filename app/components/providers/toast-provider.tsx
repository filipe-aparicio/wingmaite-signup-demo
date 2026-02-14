'use client';

import ToastList from '@/app/components/ui/toast-list';
import { Toast } from '@base-ui/react';

type Props = {
  children: React.ReactNode;
};

function ToastProvider({ children }: Props) {
  return (
    <Toast.Provider limit={1}>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="fixed bottom-4 right-4 left-4 z-50 flex justify-center pointer-events-none">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

export default ToastProvider;
