import { default as NextLink } from 'next/link';
import { HTMLAttributeAnchorTarget } from 'react';

type Props = {
  href: string;
  children: React.ReactNode;
  target?: HTMLAttributeAnchorTarget | undefined;
};
function Link({ href, children, target }: Props) {
  return (
    <NextLink href={href} target={target} className="text-pine-950 underline">
      {children}
    </NextLink>
  );
}

export default Link;
