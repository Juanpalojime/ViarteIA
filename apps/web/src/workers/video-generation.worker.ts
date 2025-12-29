/**
 * Video Generation Worker
 * Handles heavy video processing off the main thread
 */

import { VideoProcessor, type VideoProcessorConfig } from '../gpu/video-processor';

interface WorkerMessage {
    type: 'init' | 'process' | 'encode' | 'terminate';
    payload?: any;
}

interface WorkerResponse {
    type: 'ready' | 'progress' | 'complete' | 'error';
    payload?: any;
}

let processor: VideoProcessor | null = null;

// Listen for messages from main thread
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
    const { type, payload } = event.data;

    try {
        switch (type) {
            case 'init':
                await handleInit(payload);
                break;

            case 'process':
                await handleProcess(payload);
                break;

            case 'encode':
                await handleEncode(payload);
                break;

            case 'terminate':
                handleTerminate();
                break;

            default:
                throw new Error(`Unknown message type: ${type}`);
        }
    } catch (error) {
        postResponse({
            type: 'error',
            payload: {
                message: error instanceof Error ? error.message : 'Unknown error',
            },
        });
    }
};

/**
 * Initialize video processor
 */
async function handleInit(config: VideoProcessorConfig): Promise<void> {
    processor = new VideoProcessor();

    await processor.initializeEncoder(
        config,
        (chunk, metadata) => {
            postResponse({
                type: 'progress',
                payload: { chunk, metadata },
            });
        },
        (error) => {
            postResponse({
                type: 'error',
                payload: { message: error.message },
            });
        }
    );

    postResponse({ type: 'ready' });
}

/**
 * Process video frames
 */
async function handleProcess(data: {
    frames: VideoFrame[];
    settings: any;
}): Promise<void> {
    if (!processor) {
        throw new Error('Processor not initialized');
    }

    const { frames } = data;
    const totalFrames = frames.length;

    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const isKeyFrame = i % 30 === 0; // Keyframe every 30 frames

        processor.encodeFrame(frame, isKeyFrame);

        // Report progress
        const progress = ((i + 1) / totalFrames) * 100;
        postResponse({
            type: 'progress',
            payload: { progress, currentFrame: i + 1, totalFrames },
        });

        // Close frame to free memory
        frame.close();
    }

    // Flush encoder
    await processor.flushEncoder();

    // Get encoded chunks
    const chunks = processor.getEncodedChunks();

    postResponse({
        type: 'complete',
        payload: { chunks },
    });
}

/**
 * Encode frames to video
 */
async function handleEncode(data: {
    frames: ImageData[];
    config: VideoProcessorConfig;
}): Promise<void> {
    const { frames, config } = data;

    // Convert ImageData to VideoFrames
    const videoFrames: VideoFrame[] = [];

    for (let i = 0; i < frames.length; i++) {
        const imageData = frames[i];

        const videoFrame = new VideoFrame(imageData, {
            timestamp: (i * 1_000_000) / config.framerate, // microseconds
            duration: 1_000_000 / config.framerate,
        });

        videoFrames.push(videoFrame);
    }

    // Process frames
    await handleProcess({ frames: videoFrames, settings: config });
}

/**
 * Cleanup and terminate
 */
function handleTerminate(): void {
    if (processor) {
        processor.destroy();
        processor = null;
    }
    self.close();
}

/**
 * Post response to main thread
 */
function postResponse(response: WorkerResponse): void {
    self.postMessage(response);
}

// Export empty object to make TypeScript happy
export { };
