"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ComposeTweet } from "@/components/ComposeTweet";
import { Feed } from "@/components/Feed";
import { Header } from "@/components/Header";
import { RightSidebar } from "@/components/RightSidebar";
import { Sidebar } from "@/components/Sidebar";
import { AuthPanel } from "@/components/AuthPanel";
import { supabase } from "@/lib/supabase";
import type { Profile, Tweet } from "@/lib/types";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadTweets = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("tweets_with_counts")
      .select(
        "id, user_id, content, image_url, created_at, likes_count, retweets_count, comments_count, profile:profiles(id, username, full_name, avatar_url, bio, created_at)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setError("Não foi possível carregar o feed.");
      setTweets([]);
      setLoading(false);
      return;
    }

    setTweets((data as Tweet[]) ?? []);
    setLoading(false);
  }, []);

  const ensureProfile = useCallback(async (activeUser: User) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", activeUser.id)
      .single();

    if (data && !error) {
      setProfile(data);
      return data as Profile;
    }

    const baseUsername = (activeUser.email ?? "user")
      .split("@")[0]
      .replace(/[^a-zA-Z0-9_]/g, "");
    const username = `${baseUsername}${Math.floor(Math.random() * 10000)}`;

    const { data: inserted, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: activeUser.id,
        username,
        full_name: activeUser.user_metadata?.full_name ?? baseUsername,
        avatar_url: activeUser.user_metadata?.avatar_url ?? null,
      })
      .select()
      .single();

    if (insertError) {
      setError("Não foi possível criar o perfil.");
      return null;
    }

    setProfile(inserted as Profile);
    return inserted as Profile;
  }, []);

  const loadSession = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const activeUser = session?.user ?? null;
    setUser(activeUser);
    if (activeUser) {
      await ensureProfile(activeUser);
    } else {
      setProfile(null);
    }
  }, [ensureProfile]);

  useEffect(() => {
    loadSession();
    loadTweets();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const activeUser = session?.user ?? null;
        setUser(activeUser);
        if (activeUser) {
          await ensureProfile(activeUser);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [ensureProfile, loadSession, loadTweets]);

  async function handleSignIn(email: string, password: string) {
    setAuthLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError("Falha ao entrar. Verifique as credenciais.");
    }
    setAuthLoading(false);
  }

  async function handleSignUp(email: string, password: string) {
    setAuthLoading(true);
    setAuthError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setAuthError("Falha ao criar conta. Tente novamente.");
      setAuthLoading(false);
      return;
    }

    if (data.user) {
      await ensureProfile(data.user);
    }
    setAuthLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  async function handleCompose(content: string) {
    if (!user) return;
    setError(null);
    setLoading(true);
    await ensureProfile(user);
    const { error } = await supabase.from("tweets").insert({
      user_id: user.id,
      content,
    });

    if (error) {
      setError("Não foi possível publicar o tweet.");
    }

    await loadTweets();
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl">
        <Sidebar user={profile} onSignOut={handleSignOut} />
        <main className="min-h-screen w-full border-x border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
          <Header onRefresh={loadTweets} />
          <ComposeTweet
            user={profile}
            onSubmit={handleCompose}
            isSubmitting={loading}
          />
          <Feed tweets={tweets} loading={loading} error={error} />
        </main>
        <RightSidebar
          authSlot={
            user ? null : (
              <AuthPanel
                loading={authLoading}
                onSignIn={handleSignIn}
                onSignUp={handleSignUp}
                error={authError}
              />
            )
          }
        />
      </div>
    </div>
  );
}
