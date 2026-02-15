"use client";

import type { Tweet } from "@/lib/types";
import { TweetCard } from "./TweetCard";

type FeedProps = {
  tweets: Tweet[];
  loading: boolean;
  error?: string | null;
};

export function Feed({ tweets, loading, error }: FeedProps) {
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
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </section>
  );
}
