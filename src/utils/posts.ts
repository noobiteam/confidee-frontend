export const POSTS_STORAGE_KEY = "confidee_posts";

export interface Post {
  id: string;
  content: string;
  timestamp: Date;
  wallet: string;
  likes: string[];
  likeCount: number;
  aiResponse?: {
    content: string;
    timestamp: Date;
  };
  replies: Array<{
    id: string;
    content: string;
    timestamp: Date;
    wallet: string;
  }>;
}

export const getPosts = (): Post[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(POSTS_STORAGE_KEY);
    if (!stored) return [];

    const posts = JSON.parse(stored);
    return posts.map((post: any) => ({
      ...post,
      timestamp: new Date(post.timestamp),
      aiResponse: post.aiResponse
        ? {
            ...post.aiResponse,
            timestamp: new Date(post.aiResponse.timestamp),
          }
        : undefined,
      replies: post.replies.map((reply: any) => ({
        ...reply,
        timestamp: new Date(reply.timestamp),
      })),
    }));
  } catch {
    return [];
  }
};

export const savePosts = (posts: Post[]): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch {
    console.error("Failed to save posts to localStorage");
  }
};

export const savePost = (post: Post): void => {
  const posts = getPosts();
  const existingIndex = posts.findIndex((p) => p.id === post.id);

  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.unshift(post);
  }

  savePosts(posts);
};

export const getPostById = (postId: string): Post | null => {
  const posts = getPosts();
  return posts.find((post) => post.id === postId) || null;
};

export const updatePost = (postId: string, updates: Partial<Post>): void => {
  const posts = getPosts();
  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex >= 0) {
    posts[postIndex] = { ...posts[postIndex], ...updates };
    savePosts(posts);
  }
};

export const addReplyToPost = (
  postId: string,
  reply: Post["replies"][0]
): void => {
  const posts = getPosts();
  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex >= 0) {
    posts[postIndex].replies.push(reply);
    savePosts(posts);
  }
};
