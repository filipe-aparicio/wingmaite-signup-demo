"use client";

import Avatar from "@/app/components/ui/avatar";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { Blocks, House, Inbox, Menu, X } from "lucide-react";
import { useState } from "react";

function NavRight() {
  const [isOpen, setIsOpen] = useState(false);
  const breakpointSmall = useMediaQuery("screen and (max-width: 480px)");
  const showLinks = breakpointSmall ? isOpen : true;

  return (
    <>
      <div
        id="nav-right"
        className={cn(
          "bg-pine-100/40 flex shrink-0 items-center justify-center gap-3.5 rounded-xl border-t border-white/40 p-3.5 shadow-[0px_4px_4px] shadow-amber-900/10 backdrop-blur-2xl",
          isOpen && "z-50",
        )}
      >
        {showLinks && (
          <div className="flex items-center justify-center gap-3.5">
            <House size={20} className="cursor-pointer" />
            <Blocks size={20} className="cursor-pointer" />
            <Inbox size={20} className="cursor-pointer" />
          </div>
        )}
        <Avatar className="cursor-pointer" />
        {breakpointSmall && (
          <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </div>
        )}
      </div>
      {isOpen && (
        <div
          id="nav-right--overlay"
          className="absolute inset-0 z-40 h-screen w-screen"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default NavRight;
