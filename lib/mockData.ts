import type { Profile, Tweet } from "./types";

export const currentUser: Profile = {
  id: "user-1",
  username: "dev",
  full_name: "Dev User",
  avatar_url: "https://avatars.githubusercontent.com/u/9919?v=4",
  bio: "Construindo um clone do Twitter com Next.js + Supabase.",
  created_at: new Date().toISOString(),
};

export const sampleTweets: Tweet[] = [
  {
    id: "tweet-1",
    user_id: "user-1",
    content:
      "Primeiro tweet do projeto! 🚀 Estruturando o feed e os componentes principais.",
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    likes_count: 12,
    retweets_count: 3,
    comments_count: 2,
    profile: currentUser,
  },
  {
    id: "tweet-2",
    user_id: "user-2",
    content:
      "Supabase + Next.js deixa a autenticação rápida e prática. Próximo passo: RLS e policies!",
    created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    likes_count: 32,
    retweets_count: 8,
    comments_count: 5,
    profile: {
      id: "user-2",
      username: "supadev",
      full_name: "Supa Dev",
      avatar_url: "https://i.pravatar.cc/150?img=32",
      bio: "Supabase enthusiast.",
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "tweet-3",
    user_id: "user-3",
    content:
      "UI moderna + Tailwind = produtividade total. Já temos sidebar, feed e trends.",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    likes_count: 54,
    retweets_count: 16,
    comments_count: 11,
    profile: {
      id: "user-3",
      username: "tailwind",
      full_name: "TW Designer",
      avatar_url: "https://i.pravatar.cc/150?img=12",
      bio: "Design system lover.",
      created_at: new Date().toISOString(),
    },
  },
];

export const trends = [
  { topic: "#NextJS", posts: "12,8 mil" },
  { topic: "#Supabase", posts: "8,1 mil" },
  { topic: "#TailwindCSS", posts: "5,4 mil" },
  { topic: "#TypeScript", posts: "3,7 mil" },
];

export const whoToFollow = [
  {
    id: "user-4",
    username: "vercel",
    full_name: "Vercel",
    avatar_url: "https://i.pravatar.cc/150?img=56",
  },
  {
    id: "user-5",
    username: "supabase",
    full_name: "Supabase",
    avatar_url: "https://i.pravatar.cc/150?img=14",
  },
  {
    id: "user-6",
    username: "nextjs",
    full_name: "Next.js",
    avatar_url: "https://i.pravatar.cc/150?img=18",
  },
];
