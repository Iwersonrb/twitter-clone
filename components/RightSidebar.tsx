"use client";

import { useState } from "react";
import { Trends } from "./Trends";
import { WhoToFollow } from "./WhoToFollow";
import type { ReactNode } from "react";

type RightSidebarProps = {
  authSlot?: ReactNode;
};

export function RightSidebar({ authSlot }: RightSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <aside className="hidden h-screen w-80 shrink-0 gap-6 overflow-y-auto border-l border-zinc-200 px-6 py-8 dark:border-zinc-800 xl:flex xl:flex-col">
      <input
        type="text"
        placeholder="Buscar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
      />
      {authSlot}
      <Trends />
      <WhoToFollow />
    </aside>
  );
}
