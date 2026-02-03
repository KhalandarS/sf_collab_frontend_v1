import { API_BASE_URL } from "./config";

export function getProfilePicture(user) {
  if (!user) return "/default-user.jpeg";

  const raw =
    user?.profile?.picture ??
    user?.profile?.photo ??
    user?.profilePicture ??
    user?.profile_picture ??
    user?.avatar ??
    user?.avatarUrl ??
    user?.avatar_url ??
    user?.photo ??
    user?.photoUrl ??
    user?.image ??
    null;

  if (!raw) return "/default-user.jpeg";

  // Already full URL
  if (typeof raw === "string" && raw.startsWith("http")) {
    return raw;
  }

  // Clean filename
  const filename = String(raw)
    .replace(/^\/?uploads\//, "")
    .replace(/^\/+/, "");

  return `${API_BASE_URL}/users/avatars/${filename}`;
}
