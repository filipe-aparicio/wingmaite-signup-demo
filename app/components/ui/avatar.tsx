import { Avatar as AvatarBaseUI } from "@base-ui/react";
import { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<typeof AvatarBaseUI.Root> & {
  className?: string;
};

function Avatar({ className, ...props }: Props) {
  return (
    <AvatarBaseUI.Root className={className} {...props}>
      <AvatarBaseUI.Image
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="h-5 w-5 rounded-full"
      />
      <AvatarBaseUI.Fallback className="h-5 w-5 rounded-full">
        JD
      </AvatarBaseUI.Fallback>
    </AvatarBaseUI.Root>
  );
}

export default Avatar;
