import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { api, Generation } from '../services/api';
import { STYLE_PRESETS } from '../services/styles';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws/progress';

export interface VideoSettings {
    aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
    duration: number; // seconds
    fps: number;
    resolution: '720p' | '1080p' | '4k';
    quality: 'draft' | 'standard' | 'high' | 'ultra';
    upscale: boolean;
}

interface GenerationState {
    mode: 'text-to-video' | 'image-to-video';
    prompt: string;
    imageUrl: string | null;
    faceImageUrl: string | null;
    negativePrompt: string;
    settings: VideoSettings;
    jobs: Generation[];
    isGenerating: boolean;
    ws: WebSocket | null;
    selectedStyleId: string | null;

    setMode: (mode: 'text-to-video' | 'image-to-video') => void;
    setPrompt: (prompt: string) => void;
    setNegativePrompt: (prompt: string) => void;
    setImageUrl: (url: string | null) => void;
    setFaceImageUrl: (url: string | null) => void;
    setSelectedStyle: (id: string | null) => void;
    updateSettings: (settings: Partial<VideoSettings>) => void;
    resetSettings: () => void;
    startGeneration: () => Promise<void>;
    getGenerations: () => Promise<void>;
    magicPrompt: () => void;
    connectWs: () => void;
}

const defaultSettings: VideoSettings = {
    aspectRatio: '16:9',
    duration: 6,
    fps: 8,
    resolution: '720p',
    quality: 'standard',
    upscale: false,
};

export const useGenerationStore = create<GenerationState>()(
    devtools(
        persist(
            (set, get) => ({
                mode: 'text-to-video',
                prompt: '',
                imageUrl: null,
                faceImageUrl: null,
                negativePrompt: '',
                settings: defaultSettings,
                jobs: [],
                isGenerating: false,
                ws: null,
                selectedStyleId: null,

                setMode: (mode) => set({ mode }),
                setPrompt: (prompt) => set({ prompt }),
                setNegativePrompt: (negativePrompt) => set({ negativePrompt }),
                setImageUrl: (imageUrl) => set({ imageUrl }),
                setFaceImageUrl: (faceImageUrl) => set({ faceImageUrl }),
                setSelectedStyle: (selectedStyleId) => set({ selectedStyleId }),
                updateSettings: (newSettings) =>
                    set((state) => ({
                        settings: { ...state.settings, ...newSettings },
                    })),
                resetSettings: () => set({ settings: defaultSettings }),

                magicPrompt: async () => {
                    const currentPrompt = get().prompt;
                    if (!currentPrompt) return;

                    try {
                        const { magic_prompt } = await api.ai.magicPrompt(currentPrompt);
                        set({ prompt: magic_prompt });
                    } catch (error) {
                        console.error('Magic Prompt failed', error);
                        // Fallback simple enhancement if API fails
                        const enhancements = ['highly detailed', 'cinematic', '8k'];
                        const random = enhancements[Math.floor(Math.random() * enhancements.length)];
                        set({ prompt: `${currentPrompt}, ${random}` });
                    }
                },

                connectWs: () => {
                    if (get().ws) return;

                    try {
                        const ws = new WebSocket(WS_URL);

                        ws.onmessage = (event) => {
                            const message = JSON.parse(event.data);
                            if (message.type === 'generation_update') {
                                const updatedJob = message.data;
                                set((state) => {
                                    const newJobs = state.jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j));
                                    // If not found in current list, prepend
                                    if (!state.jobs.find(j => j.id === updatedJob.id)) {
                                        newJobs.unshift(updatedJob);
                                    }
                                    return {
                                        jobs: newJobs,
                                        isGenerating: newJobs.some(j => j.status === 'processing' || j.status === 'pending')
                                    };
                                });
                            }
                        };

                        ws.onclose = () => {
                            set({ ws: null });
                            setTimeout(() => get().connectWs(), 3000); // Reconnect
                        };

                        set({ ws });
                    } catch (e) {
                        console.error('WS Connection failed', e);
                    }
                },

                startGeneration: async () => {
                    const { mode, prompt, negativePrompt, settings, imageUrl, faceImageUrl, selectedStyleId } = get();
                    set({ isGenerating: true });

                    // Apply Style Preset
                    let finalPrompt = prompt;
                    let finalNegativePrompt = negativePrompt;

                    if (selectedStyleId) {
                        const style = STYLE_PRESETS.find(s => s.id === selectedStyleId);
                        if (style) {
                            finalPrompt = `${prompt}, ${style.promptEnhancement}`;
                            if (style.negativePromptEnhancement) {
                                finalNegativePrompt = `${negativePrompt}, ${style.negativePromptEnhancement}`;
                            }
                        }
                    }

                    try {
                        const job = await api.generations.create({
                            type: mode,
                            prompt: finalPrompt,
                            negativePrompt: finalNegativePrompt,
                            imageUrl: imageUrl || undefined,
                            faceImageUrl: faceImageUrl || undefined,
                            settings: {
                                aspectRatio: settings.aspectRatio,
                                duration: settings.duration,
                                fps: settings.fps,
                                upscale: settings.upscale
                            }
                        });

                        set((state) => ({
                            jobs: [job, ...state.jobs],
                        }));

                    } catch (error) {
                        console.error('Generation failed', error);
                        set({ isGenerating: false });
                        throw error;
                    }
                },

                getGenerations: async () => {
                    try {
                        const jobs = await api.generations.list();
                        set({ jobs });
                    } catch (error) {
                        console.error('Failed to fetch jobs', error);
                    }
                },
            }),
            {
                name: 'generation-storage',
                partialize: (state) => ({
                    jobs: state.jobs,
                    settings: state.settings,
                    mode: state.mode,
                    prompt: state.prompt
                }),
            }
        ),
        { name: 'GenerationStore' }
    )
);
