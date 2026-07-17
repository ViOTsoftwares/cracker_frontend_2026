import { ENV } from "../config/env";
import { store } from "../store";

export const getImageUrl = (
  filename?: string,
  folder?: string,
  fallback = "/placeholder.jpg"
): string => {
  if (!filename) {
    if (folder === "profiles") return "/default-avatar.svg";
    if (folder === "products") {
      try {
        const logo = store.getState().settings.settings?.logo;
        if (logo) {
          return `${ENV.IMAGE_URL}/logos/${logo}`;
        }
      } catch (e) {
        // Safe fallback in case store is not yet initialized
      }
    }
    return fallback;
  }
  if (
    filename.startsWith("http://") ||
    filename.startsWith("https://") ||
    filename.startsWith("data:") ||
    filename.startsWith("blob:")
  ) {
    return filename;
  }
  return `${ENV.IMAGE_URL}/${folder}/${filename}`;
};
