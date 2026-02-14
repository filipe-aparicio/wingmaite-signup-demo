'use client';
import { Toast } from '@base-ui/react';
import { useEffect } from 'react';

function Page() {
  const toast = Toast.useToastManager();

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      toast.add({
        title: 'Getting your workspace ready',
        type: 'working',
        timeout: 3000,
      });
    }, 1500);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  return null;
}

export default Page;
