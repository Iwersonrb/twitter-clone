"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Tweet, Comment } from "@/lib/types";
import { Avatar } from "./Avatar";
import { supabase } from "@/lib/supabase";

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} d`;
}

type TweetCardProps = {
  tweet: Tweet;
  canInteract: boolean;
  isBusy: boolean;
  onLike: (tweet: Tweet) => Promise<void>;
  onRetweet: (tweet: Tweet) => Promise<void>;
  onComment: (tweet: Tweet, content: string) => Promise<void>;
};

export function TweetCard({
  tweet,
  canInteract,
  isBusy,
  onLike,
  onRetweet,
  onComment,
}: TweetCardProps) {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (showComment && comments.length === 0) {
      loadComments();
    }
  }, [showComment]);

  async function loadComments() {
    setLoadingComments(true);
    const { data } = await supabase
      .from("comments")
      .select("*, profile:profiles(*)")
      .eq("tweet_id", tweet.id)
      .order("created_at", { ascending: false });
    
    if (data) {
      setComments(data as Comment[]);
    }
    setLoadingComments(false);
  }

  async function handleCommentSubmit() {
    if (!comment.trim() || isBusy) return;
    await onComment(tweet, comment.trim());
    setComment("");
    await loadComments();
  }

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
        <footer className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
          <button
            className="flex items-center gap-2 rounded-full px-2 py-1 transition hover:bg-zinc-100 disabled:opacity-60 dark:hover:bg-zinc-900"
            onClick={() => setShowComment((prev) => !prev)}
            disabled={!canInteract}
          >
            💬 {tweet.comments_count}
          </button>
          <button
            className={`flex items-center gap-2 rounded-full px-2 py-1 transition hover:bg-zinc-100 disabled:opacity-60 dark:hover:bg-zinc-900 ${
              tweet.retweeted_by_me ? "text-green-500" : ""
            }`}
            onClick={() => onRetweet(tweet)}
            disabled={!canInteract || isBusy}
          >
            🔁 {tweet.retweets_count}
          </button>
          <button
            className={`flex items-center gap-2 rounded-full px-2 py-1 transition hover:bg-zinc-100 disabled:opacity-60 dark:hover:bg-zinc-900 ${
              tweet.liked_by_me ? "text-pink-500" : ""
            }`}
            onClick={() => onLike(tweet)}
            disabled={!canInteract || isBusy}
          >
            ❤️ {tweet.likes_count}
          </button>
        </footer>
        {showComment ? (
          <div className="mt-4 rounded-2xl border border-zinc-200 p-3 dark:border-zinc-800">
            <textarea
              id={`comment-${tweet.id}`}
              name="comment"
              className="min-h-[80px] w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:text-zinc-100"
              placeholder="Escreva um comentário"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              disabled={!canInteract || isBusy}
            />
            <div className="mt-3 flex items-center justify-end">
              <button
                className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-60"
                disabled={!canInteract || isBusy || comment.trim().length === 0}
                onClick={handleCommentSubmit}
                type="button"
              >
                {isBusy ? "Enviando..." : "Comentar"}
              </button>
            </div>
            
            {/* Lista de comentários */}
            {loadingComments ? (
              <div className="mt-4 text-center text-xs text-zinc-500">
                Carregando comentários...
              </div>
            ) : comments.length > 0 ? (
              <div className="mt-4 space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                    <Avatar
                      src={c.profile?.avatar_url}
                      alt={c.profile?.full_name ?? "Usuário"}
                      size="sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {c.profile?.full_name ?? "Usuário"}
                        </span>
                        <span className="text-xs text-zinc-500">
                          @{c.profile?.username ?? "user"}
                        </span>
                        <span className="text-xs text-zinc-500">
                          · {timeAgo(c.created_at)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300">
                        {c.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 text-center text-xs text-zinc-500">
                Nenhum comentário ainda
              </div>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}
