"use client";

import Avatar from "@/app/components/ui/avatar";
import { Blocks, House, Inbox, Menu, X } from "lucide-react";
import { useState } from "react";

function NavRight() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div
      id="nav-right"
      className="bg-pine-100/40 z-20 flex shrink-0 items-center justify-center gap-3.5 rounded-xl border-t border-white/40 p-3.5 shadow-[0px_4px_4px] shadow-amber-900/10 backdrop-blur-2xl"
    >
      {isOpen && (
        <div className="flex items-center justify-center gap-3.5">
          <House size={20} className="cursor-pointer" />
          <Blocks size={20} className="cursor-pointer" />
          <Inbox size={20} className="cursor-pointer" />
        </div>
      )}
      <Avatar className="cursor-pointer" />
      <div onClick={() => setIsOpen(!isOpen)} className="hidden cursor-pointer">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </div>
    </div>
  );
}

export default NavRight;
