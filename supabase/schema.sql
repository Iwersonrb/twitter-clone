-- Schema básico para Twitter Clone

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text not null,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

create table if not exists tweets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  tweet_id uuid not null references tweets(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, tweet_id)
);

create table if not exists retweets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  tweet_id uuid not null references tweets(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, tweet_id)
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  tweet_id uuid not null references tweets(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references profiles(id) on delete cascade,
  following_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (follower_id, following_id)
);

create or replace view tweets_with_counts as
select
  t.*,
  (select count(*) from likes l where l.tweet_id = t.id) as likes_count,
  (select count(*) from retweets r where r.tweet_id = t.id) as retweets_count,
  (select count(*) from comments c where c.tweet_id = t.id) as comments_count
from tweets t;

alter table profiles enable row level security;
alter table tweets enable row level security;
alter table likes enable row level security;
alter table retweets enable row level security;
alter table comments enable row level security;
alter table follows enable row level security;

create policy "Profiles are viewable by everyone" on profiles
  for select using (true);

create policy "Users can manage own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Tweets are viewable by everyone" on tweets
  for select using (true);

create policy "Users can create tweets" on tweets
  for insert with check (auth.uid() = user_id);

create policy "Users can update own tweets" on tweets
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own tweets" on tweets
  for delete using (auth.uid() = user_id);

create policy "Likes are viewable by everyone" on likes
  for select using (true);

create policy "Users can like" on likes
  for insert with check (auth.uid() = user_id);

create policy "Users can unlike" on likes
  for delete using (auth.uid() = user_id);

create policy "Retweets are viewable by everyone" on retweets
  for select using (true);

create policy "Users can retweet" on retweets
  for insert with check (auth.uid() = user_id);

create policy "Users can unretweet" on retweets
  for delete using (auth.uid() = user_id);

create policy "Comments are viewable by everyone" on comments
  for select using (true);

create policy "Users can comment" on comments
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own comments" on comments
  for delete using (auth.uid() = user_id);

create policy "Follows are viewable by everyone" on follows
  for select using (true);

create policy "Users can follow" on follows
  for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow" on follows
  for delete using (auth.uid() = follower_id);
