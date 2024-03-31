export const ENV_CONSTANTS = {
  IS_DEV_MODE: process.env.NEXT_PUBLIC_SETTINGS === "development",
  API_BASEURL: process.env.NEXT_PUBLIC_API_BASEURL,
  MAXIMUM_ACTIVE_UPLOADS: process.env.NEXT_PUBLIC_MAXIMUM_ACTIVE_UPLOADS,
};
