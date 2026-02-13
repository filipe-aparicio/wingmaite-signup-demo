type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
};
function SignupStepShell({ title, description, children }: Props) {
  return (
    <div className="w-full max-w-md flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-serif">{title}</h1>
        <p className="text-pine-950/50">{description}</p>
      </header>
      <div className="text-pine-950/50 flex flex-col gap-10">{children}</div>
    </div>
  );
}

export default SignupStepShell;
