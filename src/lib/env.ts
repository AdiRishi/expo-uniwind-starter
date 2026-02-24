import { Platform } from "react-native";

const DEFAULT_API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

export const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL,
};
