/// <reference types="vite/client" />
const getBaseUrl = () => {
    const override = localStorage.getItem('VITE_API_URL_OVERRIDE');
    if (override) return override;
    return import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
};

const API_URL = getBaseUrl();

const getToken = () => localStorage.getItem('token');

async function request(path: string, options: RequestInit = {}) {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // ✅ Bypass Ngrok warning page
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `Request failed: ${response.statusText}`);
    }

    return response.json();
}

export interface GenerationRequest {
    type: 'text-to-video' | 'image-to-video';
    prompt: string;
    negativePrompt?: string;
    imageUrl?: string;
    faceImageUrl?: string;
    settings?: {
        aspectRatio?: string;
        duration?: number;
        fps?: number;
        resolution?: string;
        quality?: string;
        upscale?: boolean;
    };
}

export interface Generation {
    id: string;
    type: string;
    prompt: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    resultUrl?: string;
    thumbnailUrl?: string;
    error?: string;
    createdAt: string;
}

export const api = {
    generations: {
        create: (data: GenerationRequest) => request('/generations', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

        list: () => request('/generations', {
            method: 'GET',
        }),
    },

    health: {
        gpuStatus: () => request('/health/gpu', {
            method: 'GET',
        }),
    },

    assets: {
        upload: async (file: File) => {
            // ... (existing upload logic)
            const { uploadUrl, url } = await request('/assets/upload-url', {
                method: 'POST',
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type
                })
            });

            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type
                },
                body: file
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload file to storage');
            }

            return url;
        }
    },

    ai: {
        magicPrompt: (userIdea: string) => request('/ai/magic-prompt', {
            method: 'POST',
            body: JSON.stringify({ userIdea }),
        }),

        assistant: (message: string, history?: any[]) => request('/ai/assistant', {
            method: 'POST',
            body: JSON.stringify({ message, history }),
        }),
    }
};
