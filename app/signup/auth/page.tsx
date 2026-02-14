import GoogleLogo from '@/app/components/signup/google-logo';
import SignupStepShell from '@/app/components/signup/signup-step-shell';
import Button from '@/app/components/ui/button';
import Link from '@/app/components/ui/link';
import { Mail } from 'lucide-react';

export default function Page() {
  return (
    <SignupStepShell
      title="Welcome"
      description="Sign up or log in to continue"
    >
      <div className="flex flex-col gap-2.5">
        <Button
          variant="ghost"
          fullWidth
          className="font-normal"
          href="/signup/profile"
        >
          <GoogleLogo />
          Continue with Google
        </Button>

        <div className="w-full text-center">or</div>
        <Button
          variant="ghost"
          fullWidth
          className="font-normal"
          href="/signup/profile"
        >
          <Mail size={16} /> Continue with email
        </Button>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <p>
          By signing up, you agree to our{' '}
          <Link href="#">Data Protection Information</Link>
        </p>
        <p>
          Already have an account? <Link href="#">Log in</Link>
        </p>
      </div>
    </SignupStepShell>
  );
}
