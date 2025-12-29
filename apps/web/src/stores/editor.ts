import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Effect {
    id: string;
    type: 'filter' | 'color';
    name: string;
    value: string | number; // e.g., 'sepia(0.5)' or '1.2'
}

export interface Transition {
    type: 'fade' | 'slide' | 'zoom' | 'wipe' | 'glitch' | 'none';
    duration: number;
}

export interface Clip {
    id: string;
    type: 'video' | 'audio' | 'image' | 'text';
    src: string;
    start: number;
    duration: number;
    offset: number;
    trackId: string;
    name: string;
    properties?: any;
    effects?: Effect[];
    transition?: Transition; // Transition to enter this clip
}

export interface Track {
    id: string;
    type: 'video' | 'audio';
    name: string;
    clips: Clip[];
}

interface EditorState {
    tracks: Track[];
    currentTime: number;
    totalDuration: number;
    isPlaying: boolean;
    selectedClipId: string | null;
    zoom: number; // Pixels per second

    // Actions
    addTrack: (type: 'video' | 'audio') => void;
    addClip: (trackId: string, clip: Partial<Clip>) => void;
    updateClip: (id: string, updates: Partial<Clip>) => void;
    removeClip: (id: string) => void;
    setPlayhead: (time: number) => void;
    setPlaying: (isPlaying: boolean) => void;
    selectClip: (id: string | null) => void;
    setZoom: (zoom: number) => void;
}

export const useEditorStore = create<EditorState>()(
    devtools(
        (set, get) => ({
            tracks: [
                { id: 'track-1', type: 'video', name: 'Video 1', clips: [] },
                { id: 'track-2', type: 'audio', name: 'Audio 1', clips: [] }
            ],
            currentTime: 0,
            totalDuration: 30,
            isPlaying: false,
            selectedClipId: null,
            zoom: 50,

            addTrack: (type) =>
                set((state) => ({
                    tracks: [
                        ...state.tracks,
                        {
                            id: `track-${state.tracks.length + 1}`,
                            type,
                            name: `${type === 'video' ? 'Video' : 'Audio'} ${state.tracks.length + 1}`,
                            clips: []
                        }
                    ]
                })),

            addClip: (trackId, clipData) =>
                set((state) => {
                    const newClip: Clip = {
                        id: uuidv4(),
                        type: clipData.type || 'video',
                        src: clipData.src || '',
                        start: clipData.start || state.currentTime,
                        duration: clipData.duration || 5,
                        offset: clipData.offset || 0,
                        trackId,
                        name: clipData.name || 'New Clip',
                        properties: clipData.properties || {}
                    };

                    return {
                        tracks: state.tracks.map((t) =>
                            t.id === trackId ? { ...t, clips: [...t.clips, newClip] } : t
                        )
                    };
                }),

            updateClip: (id, updates) =>
                set((state) => ({
                    tracks: state.tracks.map((t) => ({
                        ...t,
                        clips: t.clips.map((c) => (c.id === id ? { ...c, ...updates } : c))
                    }))
                })),

            removeClip: (id) =>
                set((state) => ({
                    tracks: state.tracks.map((t) => ({
                        ...t,
                        clips: t.clips.filter((c) => c.id !== id)
                    })),
                    selectedClipId: state.selectedClipId === id ? null : state.selectedClipId
                })),

            setPlayhead: (time) => set({ currentTime: Math.max(0, time) }),

            setPlaying: (isPlaying) => set({ isPlaying }),

            selectClip: (id) => set({ selectedClipId: id }),

            setZoom: (zoom) => set({ zoom })
        }),
        { name: 'EditorStore' }
    )
);
