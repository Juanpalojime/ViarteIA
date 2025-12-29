import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// UI State (ephemeral)
export const sidebarOpenAtom = atom(true);
export const themeAtom = atomWithStorage<'light' | 'dark'>('theme', 'dark');
export const activePageAtom = atom('generation');

// Modal states
export const isSettingsModalOpenAtom = atom(false);
export const isUploadModalOpenAtom = atom(false);
export const isPreviewModalOpenAtom = atom(false);

// Preview state
export const previewVideoUrlAtom = atom<string | null>(null);

// Notifications
export interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
}

export const notificationsAtom = atom<Notification[]>([]);

// Derived atoms
export const hasNotificationsAtom = atom((get) => get(notificationsAtom).length > 0);

// Actions (write-only atoms)
export const addNotificationAtom = atom(
    null,
    (get, set, notification: Omit<Notification, 'id'>) => {
        const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newNotification: Notification = {
            id,
            duration: 5000,
            ...notification,
        };

        set(notificationsAtom, [...get(notificationsAtom), newNotification]);

        // Auto-remove after duration
        if (newNotification.duration) {
            setTimeout(() => {
                set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
            }, newNotification.duration);
        }
    }
);

export const removeNotificationAtom = atom(
    null,
    (get, set, id: string) => {
        set(notificationsAtom, get(notificationsAtom).filter((n) => n.id !== id));
    }
);

export const clearNotificationsAtom = atom(
    null,
    (get, set) => {
        set(notificationsAtom, []);
    }
);
