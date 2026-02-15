"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Avatar } from "./Avatar";
import type { Profile } from "@/lib/types";

type ComposeTweetProps = {
  user?: Profile | null;
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
};

const MAX_LENGTH = 280;

export function ComposeTweet({
  user,
  onSubmit,
  isSubmitting,
}: ComposeTweetProps) {
  const [content, setContent] = useState("");
  const isDisabled = !user || isSubmitting || content.trim().length === 0;
  const remaining = MAX_LENGTH - content.length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isDisabled) return;
    await onSubmit(content.trim());
    setContent("");
  }

  return (
    <section className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
      <form className="flex gap-4" onSubmit={handleSubmit}>
        <Avatar
          src={user?.avatar_url}
          alt={user?.full_name ?? "Usuário"}
          size="md"
        />
        <div className="flex-1">
          <textarea
            id="tweet-content"
            name="content"
            className="min-h-[96px] w-full resize-none rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 disabled:opacity-60 dark:border-zinc-800 dark:text-zinc-100"
            placeholder={
              user ? "O que está acontecendo?" : "Faça login para publicar"
            }
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={MAX_LENGTH}
            disabled={!user || isSubmitting}
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              {user ? `${remaining} caracteres restantes` : "Autentique para publicar"}
            </span>
            <button
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isDisabled}
              type="submit"
            >
              {isSubmitting ? "Enviando..." : "Publicar"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
