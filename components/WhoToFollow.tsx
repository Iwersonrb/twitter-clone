"use client";

import { whoToFollow } from "@/lib/mockData";
import { Avatar } from "./Avatar";

export function WhoToFollow() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Quem seguir
      </h2>
      <ul className="mt-4 flex flex-col gap-4">
        {whoToFollow.map((profile) => (
          <li key={profile.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={profile.avatar_url} alt={profile.full_name} />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {profile.full_name}
                </p>
                <p className="text-xs text-zinc-500">@{profile.username}</p>
              </div>
            </div>
            <button className="rounded-full border border-zinc-200 px-4 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800">
              Seguir
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
