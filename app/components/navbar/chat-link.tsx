type Props = {
  title: string;
  onClick: () => void;
};
function ChatLink({ title, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="w-full min-w-0 shrink-0 cursor-pointer overflow-hidden"
    >
      <p className="w-full truncate">{title}</p>
    </div>
  );
}

export default ChatLink;
