"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ComposeTweet } from "@/components/ComposeTweet";
import { Feed } from "@/components/Feed";
import { Header } from "@/components/Header";
import { RightSidebar } from "@/components/RightSidebar";
import { Sidebar } from "@/components/Sidebar";
import { AuthPanel } from "@/components/AuthPanel";
import { AuthProvider } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import type { Profile, Tweet } from "@/lib/types";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState("Início");

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
      setError(error.message);
      setTweets([]);
      setLoading(false);
      return;
    }

    let hydrated = (data as any[])?.map((t) => ({
      ...t,
      profile: Array.isArray(t.profile) ? t.profile[0] : t.profile,
    })) as Tweet[] ?? [];

    if (user) {
      const tweetIds = hydrated.map((tweet) => tweet.id);
      if (tweetIds.length > 0) {
        const [{ data: likes }, { data: retweets }] = await Promise.all([
          supabase
            .from("likes")
            .select("id, tweet_id")
            .eq("user_id", user.id)
            .in("tweet_id", tweetIds),
          supabase
            .from("retweets")
            .select("id, tweet_id")
            .eq("user_id", user.id)
            .in("tweet_id", tweetIds),
        ]);

        const likeMap = new Map(
          (likes ?? []).map((like) => [like.tweet_id, like.id])
        );
        const retweetMap = new Map(
          (retweets ?? []).map((retweet) => [retweet.tweet_id, retweet.id])
        );

        hydrated = hydrated.map((tweet) => ({
          ...tweet,
          liked_by_me: likeMap.has(tweet.id),
          like_id: likeMap.get(tweet.id),
          retweeted_by_me: retweetMap.has(tweet.id),
          retweet_id: retweetMap.get(tweet.id),
        }));
      }
    }

    setTweets(hydrated);
    setLoading(false);
  }, [user]);

  // Função estável que não muda entre renders
  const ensureProfile = useCallback(async (activeUser: User) => {
    // Evita múltiplas chamadas simultâneas
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
      if (insertError.code === "23505") {
        const { data: existing } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", activeUser.id)
          .single();

        if (existing) {
          setProfile(existing as Profile);
          return existing as Profile;
        }
      }

      setError(insertError.message);
      return null;
    }

    setProfile(inserted as Profile);
    return inserted as Profile;
  }, []);

  // Inicialização e autenticação - executa apenas uma vez
  useEffect(() => {
    let mounted = true;

    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const activeUser = session?.user ?? null;
      
      if (!mounted) return;
      
      setUser(activeUser);
      if (activeUser) {
        await ensureProfile(activeUser);
      } else {
        setProfile(null);
      }
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        
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
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []); // Executa apenas uma vez

  // Carrega tweets quando o usuário muda
  useEffect(() => {
    loadTweets();
  }, [loadTweets]);

  async function handleSignIn(email: string, password: string) {
    setAuthLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError(error.message);
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
      setAuthError(error.message);
      setAuthLoading(false);
      return;
    }

    if (data.session?.user) {
      await ensureProfile(data.session.user);
    } else {
      setAuthError(
        "Conta criada. Confirme o email para fazer login e criar o perfil."
      );
    }
    setAuthLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  async function handleCompose(content: string) {
    if (!user) {
      setError("Faça login para publicar");
      return;
    }
    setError(null);
    setPosting(true);

    try {
      const profileResult = await ensureProfile(user);
      
      if (!profileResult) {
        setError("Erro ao criar perfil. Verifique as permissões no Supabase.");
        setPosting(false);
        return;
      }

      const { error } = await supabase.from("tweets").insert({
        user_id: user.id,
        content,
      });

      if (error) {
        setError(`Erro: ${error.message}`);
        return;
      }

      // Recarrega os tweets para mostrar o novo
      await loadTweets();
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message ?? "Erro ao publicar.");
      }
    } finally {
      setPosting(false);
    }
  }

  async function handleLike(tweet: Tweet) {
    if (!user) return;
    setError(null);

    if (tweet.liked_by_me && tweet.like_id) {
      const { error } = await supabase.from("likes").delete().eq("id", tweet.like_id);
      if (error) {
        setError("Não foi possível remover a curtida.");
        return;
      }
    } else {
      const { error } = await supabase.from("likes").insert({
        user_id: user.id,
        tweet_id: tweet.id,
      });
      if (error) {
        setError("Não foi possível curtir.");
        return;
      }
    }

    await loadTweets();
  }

  async function handleRetweet(tweet: Tweet) {
    if (!user) return;
    setError(null);

    if (tweet.retweeted_by_me && tweet.retweet_id) {
      const { error } = await supabase
        .from("retweets")
        .delete()
        .eq("id", tweet.retweet_id);
      if (error) setError("Não foi possível desfazer o retweet.");
    } else {
      const { error } = await supabase.from("retweets").insert({
        user_id: user.id,
        tweet_id: tweet.id,
      });
      if (error) setError("Não foi possível retweetar.");
    }

    await loadTweets();
  }

  async function handleComment(tweet: Tweet, content: string) {
    if (!user) return;
    setError(null);

    const { error } = await supabase.from("comments").insert({
      user_id: user.id,
      tweet_id: tweet.id,
      content,
    });

    if (error) {
      setError("Não foi possível comentar.");
    }

    await loadTweets();
  }

  return (
    <AuthProvider user={user}>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
        <div className="mx-auto flex w-full max-w-6xl">
          <Sidebar user={profile} onSignOut={handleSignOut} activePage={currentPage} onNavClick={setCurrentPage} />
          <main className="min-h-screen w-full border-x border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
            <Header onRefresh={loadTweets} />
            {currentPage === "Início" ? (
              <>
                <ComposeTweet
                  user={profile}
                  onSubmit={handleCompose}
                  isSubmitting={posting}
                />
                <Feed
                  tweets={tweets}
                  loading={loading}
                  error={error}
                  canInteract={Boolean(user)}
                  isBusy={false}
                  onLike={handleLike}
                  onRetweet={handleRetweet}
                  onComment={handleComment}
                />
              </>
            ) : currentPage === "Explorar" ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-lg font-semibold">Explorar</p>
                <p className="mt-2">Em breve: busca, tendências e descobertas</p>
              </div>
            ) : currentPage === "Notificações" ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-lg font-semibold">Notificações</p>
                <p className="mt-2">Você não tem notificações no momento</p>
              </div>
            ) : currentPage === "Mensagens" ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-lg font-semibold">Mensagens</p>
                <p className="mt-2">Selecione uma conversa para começar</p>
              </div>
            ) : currentPage === "Listas" ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-lg font-semibold">Listas</p>
                <p className="mt-2">Crie listas para organizar seus seguimentos</p>
              </div>
            ) : currentPage === "Comunidades" ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-lg font-semibold">Comunidades</p>
                <p className="mt-2">Participe de comunidades sobre seus interesses</p>
              </div>
            ) : currentPage === "Perfil" ? (
              <div className="p-4">
                <div className="text-center">
                  <p className="text-lg font-semibold">{profile?.username || "Usuário"}</p>
                  <p className="text-gray-500 mt-2">{profile?.email}</p>
                  {profile?.bio && <p className="mt-4">{profile.bio}</p>}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="text-lg font-semibold">{currentPage}</p>
                <p className="mt-2">Página em desenvolvimento</p>
              </div>
            )}
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
    </AuthProvider>
  );
}
