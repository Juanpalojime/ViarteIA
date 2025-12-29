import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role?: string;
    plan?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        (set, get) => ({
            user: null,
            token: localStorage.getItem('token'),
            isAuthenticated: !!localStorage.getItem('token'),
            isLoading: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true'
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (!response.ok) throw new Error(data.error || 'Login failed');

                    localStorage.setItem('token', data.token);
                    set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
                } catch (error: any) {
                    set({ isLoading: false, error: error.message });
                    throw error;
                }
            },

            register: async (email, password, name) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_URL}/auth/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true'
                        },
                        body: JSON.stringify({ email, password, name }),
                    });

                    const data = await response.json();

                    if (!response.ok) throw new Error(data.error || 'Registration failed');

                    localStorage.setItem('token', data.token);
                    set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
                } catch (error: any) {
                    set({ isLoading: false, error: error.message });
                    throw error;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null, isAuthenticated: false });
            },

            checkAuth: async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    set({ isAuthenticated: false, user: null });
                    return;
                }

                try {
                    const response = await fetch(`${API_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'ngrok-skip-browser-warning': 'true'
                        }
                    });

                    if (response.ok) {
                        const user = await response.json();
                        set({ user, isAuthenticated: true });
                    } else {
                        // Token invalid/expired
                        localStorage.removeItem('token');
                        set({ user: null, token: null, isAuthenticated: false });
                    }
                } catch (error) {
                    localStorage.removeItem('token');
                    set({ user: null, token: null, isAuthenticated: false });
                }
            }
        }),
        { name: 'AuthStore' }
    )
);
