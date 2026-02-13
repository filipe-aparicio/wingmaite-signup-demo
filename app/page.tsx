import Logo from '@/app/components/brand/logo';
import StarlingFlow from '@/app/components/brand/starling-flow';

export default function Page() {
  return (
    <div className="bg-pine-400 w-screen h-screen flex">
      <div
        id="starling-flow"
        className="bg-scarlet-300 w-1/2 h-full flex items-center justify-center relative"
      >
        <Logo className="absolute m-auto" />
        <StarlingFlow />
      </div>
      <div
        id="sidebar"
        className="bg-white w-1/2 h-full flex items-center justify-center"
      >
        sidebar
      </div>
    </div>
  );
}
