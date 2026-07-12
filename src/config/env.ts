export const ENV = {
    NODE_ENV: import.meta.env.NODE_ENV,
    API_URL: import.meta.env.VITE_API_URL,
    IMAGE_URL: import.meta.env.VITE_IMAGE_URL,
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
}