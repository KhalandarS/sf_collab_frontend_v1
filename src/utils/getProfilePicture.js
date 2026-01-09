import { API_BASE_URL } from "./config";

export function getProfilePicture(user) {
  return user?.profile?.picture ?
    (user.profile.picture.startsWith('http') ?
      user.profile.picture : `${API_BASE_URL
      }/users/avatars/${user.profile.picture.replace(/^\/?uploads\//, "")}`)
    : "/default-user.jpeg"
}