function readPublicEnv(name: string): string {
  const value = process.env[name];
  return value?.trim() ?? "";
}

export const env = {
  apiUrl: readPublicEnv("NEXT_PUBLIC_API_URL").replace(/\/$/, ""),
  cloudinaryCloudName: readPublicEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: readPublicEnv("NEXT_PUBLIC_CLOUDINARY_API_KEY"),
};
