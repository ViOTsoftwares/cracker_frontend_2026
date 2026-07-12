import { ENV } from "../config/env";

export const getImageUrl = (filename?: string, folder?: string, fallback = "/placeholder.jpg") => {
  if (!filename) {
    if (folder === "profiles") return "/default-avatar.svg";
    return fallback;
  }
  if (filename.startsWith("http://") || filename.startsWith("https://") || filename.startsWith("data:") || filename.startsWith("blob:")) {
    return filename;
  }
  return `${ENV.IMAGE_URL}/${folder}/${filename}`;
};
