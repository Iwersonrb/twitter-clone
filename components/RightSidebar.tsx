"use client";

import { Trends } from "./Trends";
import { WhoToFollow } from "./WhoToFollow";
import type { ReactNode } from "react";

type RightSidebarProps = {
  authSlot?: ReactNode;
};

export function RightSidebar({ authSlot }: RightSidebarProps) {
  return (
    <aside className="hidden h-screen w-80 shrink-0 gap-6 overflow-y-auto border-l border-zinc-200 px-6 py-8 dark:border-zinc-800 xl:flex xl:flex-col">
      <div className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
        Buscar
      </div>
      {authSlot}
      <Trends />
      <WhoToFollow />
    </aside>
  );
}
