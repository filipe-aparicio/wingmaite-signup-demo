import Button from '@/app/components/ui/button';
import { LogIn } from 'lucide-react';

export default function Page() {
  return (
    <div className="bg-pine-50 w-screen h-screen flex items-center justify-center">
      <Button variant="primary" href="/signup">
        <LogIn size={16} /> Log in
      </Button>
    </div>
  );
}
