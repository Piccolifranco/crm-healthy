import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { removeCookie } from '../cookies';

interface User {
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            setAuth: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
            logout: () => {
                removeCookie('accessToken');
                removeCookie('refreshToken');
                set({ user: null, accessToken: null, refreshToken: null });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
