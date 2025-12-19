import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useLogin } from "../../lib/services/auth";
import { useAuthStore } from "../../lib/store/authStore";
import { useQueryClient } from "@tanstack/react-query";

interface LoginProps {
  onRegisterClick: () => void;
}

interface DecodedToken {
  role: string;
  // Add other fields if needed
}

export default function Login({ onRegisterClick }: LoginProps) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { mutateAsync: login } = useLogin();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const savedUser = localStorage.getItem("rememberedUser");
    if (savedUser) {
      setUser(savedUser);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await login({ email: user, password }, {
      onSuccess: (data) => {
        const accessToken = data?.data.accessToken;
        const refreshToken = data?.data.refreshToken;
        document.cookie = `accessToken=${accessToken}; path=/; max-age=86400`;

        if (rememberMe) {
          localStorage.setItem("rememberedUser", user);
        } else {
          localStorage.removeItem("rememberedUser");
        }

        toast.success("Inicio de sesión exitoso");
        queryClient.clear();

        // Decodificar token para obtener el rol
        try {
          const decoded = jwtDecode<DecodedToken>(accessToken);
          const role = decoded.role;

          // Store in Zustand
          useAuthStore.getState().setAuth(
            { email: user, role },
            accessToken,
            refreshToken
          );


          setTimeout(() => {
            if (role === "ADMIN") {
              router.push("/pacientes");
            } else if (role === "CUSTOMER") {
              // Asumimos que la home del customer es /turnos
              router.push("/historia-clinica");
            } else {
              // Fallback
              router.push("/");
            }
          }, 500);
        } catch (error) {
          console.error("Error decoding token:", error);
          // Fallback en caso de error
          router.push("/");
        }
      },
      onError: () => {
        toast.error("Correo electrónico o contraseña incorrectos");
      }
    })
  }

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-4">
        <label
          htmlFor="user"
          className="block text-sm font-medium text-gray-700"
        >
          Usuario
        </label>
        <input
          type="text"
          id="user"
          placeholder="Usuario"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-900"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          placeholder="Contraseña"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-gray-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <input
            id="remember_me"
            name="remember_me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label
            htmlFor="remember_me"
            className="ml-2 block text-sm text-gray-900"
          >
            Recordarme
          </label>
        </div>
        <div className="text-sm flex items-center">
          <a
            href="#"
            className="font-medium text-gray-900 hover:text-gray-800"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

      </div>
      <div className="text-sm mb-4">
        <button
          type="button"
          onClick={onRegisterClick}
          className="font-medium text-gray-900 hover:text-gray-800"
        >
          ¿No tienes una cuenta? <span className="cursor-pointer text-blue-600">Registrate</span>
        </button>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 cursor-pointer border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Iniciar Sesión
      </button>
    </form>
  );
}
