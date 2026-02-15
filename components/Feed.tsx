"use client";

import type { Tweet } from "@/lib/types";
import { TweetCard } from "./TweetCard";

type FeedProps = {
  tweets: Tweet[];
  loading: boolean;
  error?: string | null;
  canInteract: boolean;
  isBusy: boolean;
  onLike: (tweet: Tweet) => Promise<void>;
  onRetweet: (tweet: Tweet) => Promise<void>;
  onComment: (tweet: Tweet, content: string) => Promise<void>;
};

export function Feed({
  tweets,
  loading,
  error,
  canInteract,
  isBusy,
  onLike,
  onRetweet,
  onComment,
}: FeedProps) {
  return (
    <section>
      {loading ? (
        <div className="px-6 py-10 text-sm text-zinc-500">Carregando...</div>
      ) : null}
      {error ? (
        <div className="px-6 py-6 text-sm text-red-500">{error}</div>
      ) : null}
      {!loading && !error && tweets.length === 0 ? (
        <div className="px-6 py-10 text-sm text-zinc-500">
          Nenhum tweet ainda.
        </div>
      ) : null}
      {tweets.map((tweet) => (
        <TweetCard
          key={tweet.id}
          tweet={tweet}
          canInteract={canInteract}
          isBusy={isBusy}
          onLike={onLike}
          onRetweet={onRetweet}
          onComment={onComment}
        />
      ))}
    </section>
  );
}
