import axios from "axios";
import { getCookieValue } from "@/app/lib/cookies";

export const api = axios.create({
  baseURL: "https://devlights-project-backend.vercel.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token desde cookie
api.interceptors.request.use((config) => {
  const token = getCookieValue("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});