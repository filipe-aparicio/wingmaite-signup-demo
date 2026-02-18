import Navbar from '@/app/components/navbar/navbar';
import Button from '@/app/components/ui/button';
import { LogIn } from 'lucide-react';

export default function Page() {
  return (
    <div className="bg-pine-50 w-screen h-screen flex items-center justify-center">
      <Navbar />
      <Button variant="primary" href="/signup">
        <LogIn size={16} /> Log in
      </Button>
    </div>
  );
}
