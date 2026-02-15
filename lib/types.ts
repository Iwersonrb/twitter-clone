export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url?: string
  bio?: string
  created_at: string
}

export interface Tweet {
  id: string
  user_id: string
  content: string
  image_url?: string
  created_at: string
  likes_count: number
  retweets_count: number
  comments_count: number
  profile?: Profile
  liked_by_me?: boolean
  retweeted_by_me?: boolean
  like_id?: string
  retweet_id?: string
}

export interface Like {
  id: string
  user_id: string
  tweet_id: string
  created_at: string
}

export interface Retweet {
  id: string
  user_id: string
  tweet_id: string
  created_at: string
}

export interface Comment {
  id: string
  user_id: string
  tweet_id: string
  content: string
  created_at: string
  profile?: Profile
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}
