import SignupStepShell from '@/app/components/signup/signup-step-shell';
import Button from '@/app/components/ui/button';
import Checkbox from '@/app/components/ui/checkbox';
import Input from '@/app/components/ui/input';
import { ArrowRight } from 'lucide-react';

export default function Page() {
  return (
    <SignupStepShell
      title="Your profile"
      description="Tell us a little about yourself"
    >
      <div>
        <label className="text-pine-950">Name</label>
        <div className="flex w-full gap-3">
          <Input className="w-full" placeholder="First name" />
          <Input className="w-full" placeholder="Last name" />
        </div>
      </div>
      <div>
        <Checkbox label="Keep me updated with product offers and updates via email" />
      </div>
      <div className="flex justify-end">
        <Button variant="success" size="sm" href="/signup/loading">
          Continue <ArrowRight size={16} />
        </Button>
      </div>
    </SignupStepShell>
  );
}
