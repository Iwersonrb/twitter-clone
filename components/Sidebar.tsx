"use client";

import { Avatar } from "./Avatar";
import type { Profile } from "@/lib/types";

const navItems = [
  "Início",
  "Explorar",
  "Notificações",
  "Mensagens",
  "Listas",
  "Comunidades",
  "Perfil",
  "Mais",
];

type SidebarProps = {
  user?: Profile | null;
  onSignOut: () => Promise<void>;
};

export function Sidebar({ user, onSignOut }: SidebarProps) {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-zinc-200 px-6 py-8 dark:border-zinc-800 lg:block">
      <div className="flex items-center gap-3 text-xl font-semibold text-sky-500">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white">
          T
        </span>
        Twitter Clone
      </div>

      <nav className="mt-10 flex flex-col gap-3 text-base text-zinc-700 dark:text-zinc-200">
        {navItems.map((item) => (
          <button
            key={item}
            className="flex items-center gap-3 rounded-full px-4 py-2 text-left transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {item}
          </button>
        ))}
      </nav>

      <button className="mt-6 w-full rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-white">
        Tweetar
      </button>

      <div className="mt-auto pt-10">
        {user ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar src={user.avatar_url} alt={user.full_name} />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {user.full_name}
                </p>
                <p className="text-xs text-zinc-500">@{user.username}</p>
              </div>
            </div>
            <button
              className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              onClick={onSignOut}
            >
              Sair
            </button>
          </div>
        ) : (
          <p className="text-xs text-zinc-500">Faça login para publicar.</p>
        )}
      </div>
    </aside>
  );
}
