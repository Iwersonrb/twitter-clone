"use client";

import { trends } from "@/lib/mockData";

export function Trends() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Assuntos do momento
      </h2>
      <ul className="mt-4 flex flex-col gap-4 text-sm">
        {trends.map((trend) => (
          <li key={trend.topic}>
            <p className="text-zinc-500">Trending no Brasil</p>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              {trend.topic}
            </p>
            <p className="text-zinc-500">{trend.posts} Tweets</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
