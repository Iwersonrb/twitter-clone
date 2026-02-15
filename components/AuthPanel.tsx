"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type AuthPanelProps = {
  loading: boolean;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  error?: string | null;
};

export function AuthPanel({ loading, onSignIn, onSignUp, error }: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSignIn(email, password);
  }


  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Entrar
      </h2>
      <p className="mt-2 text-xs text-zinc-500">
        Use email e senha para autenticar.
      </p>
      <form className="mt-4 space-y-3" onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-sky-500 dark:border-zinc-700 dark:text-zinc-100"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-sky-500 dark:border-zinc-700 dark:text-zinc-100"
          required
        />
        <button
          className="w-full rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <button
        type="button"
        className="mt-3 w-full rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        onClick={() => onSignUp(email, password)}
        disabled={loading}
      >
        {loading ? "Criando..." : "Criar conta"}
      </button>
      {error ? (
        <p className="mt-3 text-xs text-red-500">{error}</p>
      ) : null}
    </section>
  );
}
