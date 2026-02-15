"use client";

type HeaderProps = {
  onRefresh: () => Promise<void>;
};

export function Header({ onRefresh }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Início
        </h1>
        <button
          className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          onClick={onRefresh}
        >
          Atualizar
        </button>
      </div>
    </header>
  );
}
