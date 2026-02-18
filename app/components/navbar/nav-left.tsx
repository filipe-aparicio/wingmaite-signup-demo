"use client";

import StarlingIcon from "@/app/components/brand/starling-icon";
import ChatLink from "@/app/components/navbar/chat-link";
import { cn } from "@/lib/utils";
import { PanelLeft } from "lucide-react";
import { useState } from "react";

type Props = {
  data: { id: string; title: string }[];
};
function NavLeft({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState("123lhwe243r");

  const handleChatClick = (id: string) => {
    setActiveChat(id);
    setIsOpen(false);
  };

  return (
    <>
      <div
        id="nav-left"
        className="bg-pine-100/40 z-40 flex max-h-[calc(100dvh-1rem)] w-sm min-w-0 flex-col items-start justify-start gap-3.5 rounded-xl border-t border-white/40 p-3.5 shadow-[0px_4px_4px] shadow-amber-900/10 backdrop-blur-2xl"
      >
        <div
          id="nav-left--top"
          className="flex w-full min-w-0 items-center justify-between gap-3.5"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3.5">
            <StarlingIcon />
            <div className="overflow-hidden">
              <p
                className={cn(
                  "min-w-0 translate-y-0 truncate leading-tight transition-all",
                  isOpen && "translate-y-5",
                )}
              >
                {data.find((chat) => chat.id === activeChat)?.title ||
                  "New chat"}
              </p>
            </div>
          </div>
          <PanelLeft
            size={20}
            className="shrink-0 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        {data && isOpen && (
          <div
            id="nav-left--bottom"
            className="flex max-h-full w-full min-w-0 flex-col gap-0.5 overflow-auto"
          >
            {data.map((chat) => (
              <ChatLink
                key={chat.id}
                title={chat.title}
                active={chat.id === activeChat}
                onClick={() => handleChatClick(chat.id)}
              />
            ))}
          </div>
        )}
      </div>
      {isOpen && (
        <div
          id="nav-left--overlay"
          className="absolute inset-0 z-30 h-screen w-screen"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default NavLeft;
