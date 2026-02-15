"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types";
import { Avatar } from "./Avatar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

export function WhoToFollow() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadProfiles();
  }, [user]);

  async function loadProfiles() {
    setLoading(true);
    
    // Se não há usuário, não carrega perfis
    if (!user?.id) {
      setProfiles([]);
      setLoading(false);
      return;
    }
    
    // Carrega 5 perfis aleatórios (exceto o usuário atual)
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .neq("id", user.id)
      .limit(5);

    if (data) {
      setProfiles(data as Profile[]);
    }

    // Carrega os seguindo do usuário atual
    if (user) {
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);

      if (follows) {
        setFollowing(new Set(follows.map(f => f.following_id)));
      }
    }

    setLoading(false);
  }

  async function handleFollow(profileId: string) {
    if (!user) return;

    if (following.has(profileId)) {
      // Unfollow
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", profileId);
      
      setFollowing(prev => {
        const next = new Set(prev);
        next.delete(profileId);
        return next;
      });
    } else {
      // Follow
      await supabase
        .from("follows")
        .insert({
          follower_id: user.id,
          following_id: profileId,
        });
      
      setFollowing(prev => new Set([...prev, profileId]));
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-xs text-zinc-500">Carregando...</div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Quem seguir
      </h2>
      <ul className="mt-4 flex flex-col gap-4">
        {profiles.map((profile) => (
          <li key={profile.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={profile.avatar_url} alt={profile.full_name} />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {profile.full_name}
                </p>
                <p className="text-xs text-zinc-500">@{profile.username}</p>
              </div>
            </div>
            <button
              onClick={() => handleFollow(profile.id)}
              className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                following.has(profile.id)
                  ? "bg-zinc-200 text-zinc-900 hover:bg-red-100 hover:text-red-600 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-red-900"
                  : "border border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              {following.has(profile.id) ? "Seguindo" : "Seguir"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
