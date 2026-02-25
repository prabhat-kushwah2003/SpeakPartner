const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/previews/002/551/781/non_2x/avatar-using-laptop-online-education-and-development-elearning-gradient-style-icon-free-vector.jpg";

/**
 * Resolves the correct avatar URL.
 * - If avatar is missing/empty → returns the default avatar.
 * - If avatar is already a full URL (starts with http) → returns as-is.
 * - If avatar is a relative path (e.g. /uploads/avatars/...) → prepends VITE_API_URL.
 */
export function getAvatarUrl(avatar) {
    if (!avatar) return DEFAULT_AVATAR;
    if (avatar.startsWith("http")) return avatar;
    return `${import.meta.env.VITE_API_URL}${avatar}`;
}
