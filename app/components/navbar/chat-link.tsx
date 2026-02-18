import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";

type Props = {
  title: string;
  active?: boolean;
  onClick: () => void;
};
function ChatLink({ title, active, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex w-full min-w-0 shrink-0 cursor-pointer items-center justify-between gap-3.5 overflow-hidden rounded-md px-3 py-2",
        active ? "bg-white hover:bg-white" : "hover:bg-white/50",
      )}
    >
      <p className="w-full truncate">{title}</p>
      <Ellipsis size={16} className="hidden group-hover:block" />
    </div>
  );
}

export default ChatLink;
