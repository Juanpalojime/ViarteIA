import { useEffect, useRef, useCallback } from 'react';
import type { VideoProcessorConfig } from '../gpu/video-processor';

interface UseVideoWorkerOptions {
    onReady?: () => void;
    onProgress?: (data: { progress: number; currentFrame: number; totalFrames: number }) => void;
    onComplete?: (data: { chunks: EncodedVideoChunk[] }) => void;
    onError?: (error: Error) => void;
}

export function useVideoWorker(options: UseVideoWorkerOptions = {}) {
    const workerRef = useRef<Worker | null>(null);
    const { onReady, onProgress, onComplete, onError } = options;

    useEffect(() => {
        // Create worker
        workerRef.current = new Worker(
            new URL('../workers/video-generation.worker.ts', import.meta.url),
            { type: 'module' }
        );

        // Listen for messages
        workerRef.current.onmessage = (event) => {
            const { type, payload } = event.data;

            switch (type) {
                case 'ready':
                    onReady?.();
                    break;

                case 'progress':
                    if (payload.progress !== undefined) {
                        onProgress?.(payload);
                    }
                    break;

                case 'complete':
                    onComplete?.(payload);
                    break;

                case 'error':
                    onError?.(new Error(payload.message));
                    break;
            }
        };

        // Cleanup on unmount
        return () => {
            workerRef.current?.terminate();
            workerRef.current = null;
        };
    }, [onReady, onProgress, onComplete, onError]);

    const initialize = useCallback((config: VideoProcessorConfig) => {
        workerRef.current?.postMessage({
            type: 'init',
            payload: config,
        });
    }, []);

    const processFrames = useCallback((frames: VideoFrame[], settings: any) => {
        workerRef.current?.postMessage({
            type: 'process',
            payload: { frames, settings },
        });
    }, []);

    const encodeFrames = useCallback((frames: ImageData[], config: VideoProcessorConfig) => {
        workerRef.current?.postMessage({
            type: 'encode',
            payload: { frames, config },
        });
    }, []);

    const terminate = useCallback(() => {
        workerRef.current?.postMessage({ type: 'terminate' });
        workerRef.current = null;
    }, []);

    return {
        initialize,
        processFrames,
        encodeFrames,
        terminate,
    };
}
