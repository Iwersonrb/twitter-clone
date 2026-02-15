"use client";

import Image from "next/image";
import type { Tweet } from "@/lib/types";
import { Avatar } from "./Avatar";

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} d`;
}

export function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <article className="flex gap-4 border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
      <Avatar
        src={tweet.profile?.avatar_url}
        alt={tweet.profile?.full_name ?? "Usuário"}
        size="md"
      />
      <div className="flex-1">
        <header className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {tweet.profile?.full_name ?? "Usuário"}
          </span>
          <span className="text-zinc-500">@{tweet.profile?.username}</span>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-500">{timeAgo(tweet.created_at)}</span>
        </header>
        <p className="mt-2 whitespace-pre-line text-[15px] leading-6 text-zinc-900 dark:text-zinc-100">
          {tweet.content}
        </p>
        {tweet.image_url ? (
          <div className="relative mt-4 h-64 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <Image
              src={tweet.image_url}
              alt="Imagem do tweet"
              fill
              className="object-cover"
            />
          </div>
        ) : null}
        <footer className="mt-4 flex items-center gap-6 text-sm text-zinc-500">
          <span className="flex items-center gap-2">💬 {tweet.comments_count}</span>
          <span className="flex items-center gap-2">🔁 {tweet.retweets_count}</span>
          <span className="flex items-center gap-2">❤️ {tweet.likes_count}</span>
        </footer>
      </div>
    </article>
  );
}
