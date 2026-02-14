'use client';

import SignupStepShell from '@/app/components/signup/signup-step-shell';
import Button from '@/app/components/ui/button';
import { Toast } from '@base-ui/react';
import { LucideLogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

function Page() {
  const toast = Toast.useToastManager();
  const router = useRouter();
  const resendTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resendTimeoutRef.current !== null) {
        toast.close('email-request');
        window.clearTimeout(resendTimeoutRef.current);
      }
    };
  }, []);

  const handleResend = () => {
    toast.add({
      id: 'email-request',
      title: 'Email sent. Please wait 60s to request again.',
      type: 'email',
      timeout: 60000,
    });

    if (resendTimeoutRef.current !== null) {
      window.clearTimeout(resendTimeoutRef.current);
    }

    resendTimeoutRef.current = window.setTimeout(() => {
      toast.close('email-request');
      router.push('/signup/profile');
      resendTimeoutRef.current = null;
    }, 3000);
  };
  return (
    <SignupStepShell
      title="Check your inbox"
      description={
        <span>
          We've sent a verification email to{' '}
          <span className="text-pine-950">john@acme.com</span>. <br /> Open it
          to continue.
        </span>
      }
    >
      <p>
        Didn't receive the email? Check your spam or{' '}
        <span
          onClick={handleResend}
          className="text-pine-950 underline cursor-pointer"
        >
          resend
        </span>
        .
      </p>
      <Button variant="faded" href="/signup/auth">
        <LucideLogOut size={16} /> Log out
      </Button>
    </SignupStepShell>
  );
}

export default Page;
