import axios from "axios";
import { getCookieValue } from "@/app/lib/cookies";
import { useAuthStore } from "./store/authStore";

export const api = axios.create({
  baseURL: "https://devlights-project-backend-nine.vercel.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token desde cookie o store
api.interceptors.request.use((config) => {
  // Priorizar el token del store (memoria) que se actualiza inmediatamente al login
  let token = useAuthStore.getState().accessToken;

  // Si no hay token en store, intentar leer de cookie
  if (!token) {
    token = getCookieValue("accessToken");
  }

  if (token && !config.url?.includes("/auth/login") && !config.url?.includes("/auth/register")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para manejar errores de respuesta (ej: 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);