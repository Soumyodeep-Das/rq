import { create } from 'zustand';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';

interface AuthState {
    user: Models.User<Models.Preferences> | null;
    loading: boolean;
    setUser: (user: Models.User<Models.Preferences> | null) => void;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    fetchUser: async () => {
        set({ loading: true });
        try {
            const user = await account.get();
            set({ user, loading: false });
        } catch {
            set({ user: null, loading: false });
        }
    },
    logout: async () => {
        try {
            await account.deleteSession("current");
            set({ user: null });
        } catch (error) {
            console.error(error);
        }
    }
}));
