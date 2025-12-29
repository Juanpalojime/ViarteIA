/**
 * WebCodecs Video Processor for hardware-accelerated video encoding/decoding
 */

export interface VideoProcessorConfig {
    codec: string;
    width: number;
    height: number;
    bitrate: number;
    framerate: number;
    hardwareAcceleration?: 'prefer-hardware' | 'prefer-software' | 'no-preference';
}

export class VideoProcessor {
    private encoder: VideoEncoder | null = null;
    private decoder: VideoDecoder | null = null;
    private encodedChunks: EncodedVideoChunk[] = [];

    /**
     * Initialize video encoder
     */
    async initializeEncoder(
        config: VideoProcessorConfig,
        onChunk: (chunk: EncodedVideoChunk, metadata?: EncodedVideoChunkMetadata) => void,
        onError: (error: Error) => void
    ): Promise<void> {
        try {
            this.encoder = new VideoEncoder({
                output: (chunk, metadata) => {
                    this.encodedChunks.push(chunk);
                    onChunk(chunk, metadata);
                },
                error: (e) => {
                    console.error('❌ Encoder error:', e);
                    onError(e instanceof Error ? e : new Error(String(e)));
                },
            });

            const encoderConfig: VideoEncoderConfig = {
                codec: config.codec,
                width: config.width,
                height: config.height,
                bitrate: config.bitrate,
                framerate: config.framerate,
                hardwareAcceleration: config.hardwareAcceleration || 'prefer-hardware',
            };

            // Check if config is supported
            const support = await VideoEncoder.isConfigSupported(encoderConfig);
            if (!support.supported) {
                throw new Error(`Encoder config not supported: ${JSON.stringify(encoderConfig)}`);
            }

            this.encoder.configure(encoderConfig);
            console.log('✅ Video encoder initialized');
        } catch (error) {
            console.error('❌ Encoder initialization failed:', error);
            throw error;
        }
    }

    /**
     * Initialize video decoder
     */
    async initializeDecoder(
        codec: string,
        onFrame: (frame: VideoFrame) => void,
        onError: (error: Error) => void
    ): Promise<void> {
        try {
            this.decoder = new VideoDecoder({
                output: (frame) => {
                    onFrame(frame);
                },
                error: (e) => {
                    console.error('❌ Decoder error:', e);
                    onError(e instanceof Error ? e : new Error(String(e)));
                },
            });

            const decoderConfig: VideoDecoderConfig = {
                codec,
            };

            // Check if config is supported
            const support = await VideoDecoder.isConfigSupported(decoderConfig);
            if (!support.supported) {
                throw new Error(`Decoder config not supported: ${codec}`);
            }

            this.decoder.configure(decoderConfig);
            console.log('✅ Video decoder initialized');
        } catch (error) {
            console.error('❌ Decoder initialization failed:', error);
            throw error;
        }
    }

    /**
     * Encode a video frame
     */
    encodeFrame(frame: VideoFrame, keyFrame = false): void {
        if (!this.encoder) {
            throw new Error('Encoder not initialized');
        }

        try {
            this.encoder.encode(frame, { keyFrame });
        } catch (error) {
            console.error('❌ Frame encoding failed:', error);
            throw error;
        }
    }

    /**
     * Decode a video chunk
     */
    decodeChunk(chunk: EncodedVideoChunk): void {
        if (!this.decoder) {
            throw new Error('Decoder not initialized');
        }

        try {
            this.decoder.decode(chunk);
        } catch (error) {
            console.error('❌ Chunk decoding failed:', error);
            throw error;
        }
    }

    /**
     * Flush encoder (finish encoding)
     */
    async flushEncoder(): Promise<void> {
        if (!this.encoder) return;

        try {
            await this.encoder.flush();
            console.log('✅ Encoder flushed');
        } catch (error) {
            console.error('❌ Encoder flush failed:', error);
            throw error;
        }
    }

    /**
     * Flush decoder (finish decoding)
     */
    async flushDecoder(): Promise<void> {
        if (!this.decoder) return;

        try {
            await this.decoder.flush();
            console.log('✅ Decoder flushed');
        } catch (error) {
            console.error('❌ Decoder flush failed:', error);
            throw error;
        }
    }

    /**
     * Get all encoded chunks
     */
    getEncodedChunks(): EncodedVideoChunk[] {
        return this.encodedChunks;
    }

    /**
     * Clear encoded chunks
     */
    clearChunks(): void {
        this.encodedChunks = [];
    }

    /**
     * Cleanup resources
     */
    destroy(): void {
        if (this.encoder) {
            this.encoder.close();
            this.encoder = null;
        }
        if (this.decoder) {
            this.decoder.close();
            this.decoder = null;
        }
        this.encodedChunks = [];
    }

    /**
     * Check if WebCodecs is supported
     */
    static isSupported(): boolean {
        return 'VideoEncoder' in window && 'VideoDecoder' in window;
    }

    /**
     * Get supported codecs
     */
    static async getSupportedCodecs(): Promise<string[]> {
        const codecs = [
            'vp8',
            'vp09.00.10.08',
            'avc1.42001E', // H.264 Baseline
            'avc1.4D401E', // H.264 Main
            'avc1.64001E', // H.264 High
            'av01.0.05M.08', // AV1
        ];

        const supported: string[] = [];

        for (const codec of codecs) {
            const config: VideoEncoderConfig = {
                codec,
                width: 1920,
                height: 1080,
                bitrate: 5_000_000,
                framerate: 30,
            };

            const support = await VideoEncoder.isConfigSupported(config);
            if (support.supported) {
                supported.push(codec);
            }
        }

        return supported;
    }
}
