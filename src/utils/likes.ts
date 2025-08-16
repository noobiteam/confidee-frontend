export const LIKES_STORAGE_KEY = "confidee_likes";

export interface LikesData {
  [postId: string]: string[];
}

export const getLikes = (): LikesData => {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(LIKES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const saveLike = (postId: string, walletAddress: string): void => {
  if (typeof window === "undefined") return;

  const likes = getLikes();
  if (!likes[postId]) {
    likes[postId] = [];
  }

  if (!likes[postId].includes(walletAddress)) {
    likes[postId].push(walletAddress);
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
  }
};

export const removeLike = (postId: string, walletAddress: string): void => {
  if (typeof window === "undefined") return;

  const likes = getLikes();
  if (likes[postId]) {
    likes[postId] = likes[postId].filter((wallet) => wallet !== walletAddress);

    if (likes[postId].length === 0) {
      delete likes[postId];
    }

    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
  }
};

export const hasUserLiked = (
  postId: string,
  walletAddress: string
): boolean => {
  const likes = getLikes();
  return likes[postId] ? likes[postId].includes(walletAddress) : false;
};

export const getLikeData = (
  postId: string
): { likes: string[]; likeCount: number } => {
  const likes = getLikes();
  const postLikes = likes[postId] || [];

  return {
    likes: postLikes,
    likeCount: postLikes.length,
  };
};
