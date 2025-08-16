export const USERNAME_STORAGE_KEY = "confidee_usernames";

export interface UsernameData {
  [walletAddress: string]: string;
}

export const getUsernames = (): UsernameData => {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(USERNAME_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const saveUsername = (walletAddress: string, username: string): void => {
  if (typeof window === "undefined") return;

  const usernames = getUsernames();
  usernames[walletAddress] = username;
  localStorage.setItem(USERNAME_STORAGE_KEY, JSON.stringify(usernames));
};

export const getUsername = (walletAddress: string): string | null => {
  const usernames = getUsernames();
  return usernames[walletAddress] || null;
};

export const hasUsername = (walletAddress: string): boolean => {
  return getUsername(walletAddress) !== null;
};
