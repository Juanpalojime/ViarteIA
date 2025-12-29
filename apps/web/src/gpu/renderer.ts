/**
 * WebGPU Renderer for hardware-accelerated video rendering
 */
export class WebGPURenderer {
    private device: GPUDevice | null = null;
    private context: GPUCanvasContext | null = null;
    private pipeline: GPURenderPipeline | null = null;
    private isInitialized = false;

    /**
     * Initialize WebGPU device and context
     */
    async initialize(canvas: HTMLCanvasElement): Promise<void> {
        if (this.isInitialized) return;

        // Check WebGPU support
        if (!navigator.gpu) {
            throw new Error('WebGPU is not supported in this browser');
        }

        try {
            // Request adapter
            const adapter = await navigator.gpu.requestAdapter({
                powerPreference: 'high-performance',
            });

            if (!adapter) {
                throw new Error('Failed to get GPU adapter');
            }

            // Request device
            this.device = await adapter.requestDevice();

            // Get canvas context
            this.context = canvas.getContext('webgpu');

            if (!this.context) {
                throw new Error('Failed to get WebGPU context');
            }

            // Configure context
            const format = navigator.gpu.getPreferredCanvasFormat();
            this.context.configure({
                device: this.device,
                format,
                alphaMode: 'premultiplied',
            });

            // Create render pipeline
            await this.createPipeline(format);

            this.isInitialized = true;
            console.log('✅ WebGPU initialized successfully');
        } catch (error) {
            console.error('❌ WebGPU initialization failed:', error);
            throw error;
        }
    }

    /**
     * Create render pipeline
     */
    private async createPipeline(format: GPUTextureFormat): Promise<void> {
        if (!this.device) throw new Error('Device not initialized');

        const shaderModule = this.device.createShaderModule({
            code: `
        struct VertexOutput {
          @builtin(position) position: vec4<f32>,
          @location(0) texCoord: vec2<f32>,
        }

        @vertex
        fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
          var pos = array<vec2<f32>, 6>(
            vec2<f32>(-1.0, -1.0),
            vec2<f32>(1.0, -1.0),
            vec2<f32>(-1.0, 1.0),
            vec2<f32>(-1.0, 1.0),
            vec2<f32>(1.0, -1.0),
            vec2<f32>(1.0, 1.0),
          );

          var texCoord = array<vec2<f32>, 6>(
            vec2<f32>(0.0, 1.0),
            vec2<f32>(1.0, 1.0),
            vec2<f32>(0.0, 0.0),
            vec2<f32>(0.0, 0.0),
            vec2<f32>(1.0, 1.0),
            vec2<f32>(1.0, 0.0),
          );

          var output: VertexOutput;
          output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
          output.texCoord = texCoord[vertexIndex];
          return output;
        }

        @group(0) @binding(0) var textureSampler: sampler;
        @group(0) @binding(1) var textureData: texture_2d<f32>;

        @fragment
        fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
          return textureSample(textureData, textureSampler, input.texCoord);
        }
      `,
        });

        this.pipeline = this.device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: shaderModule,
                entryPoint: 'vertexMain',
            },
            fragment: {
                module: shaderModule,
                entryPoint: 'fragmentMain',
                targets: [{ format }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });
    }

    /**
     * Render a video frame to canvas
     */
    async renderFrame(videoFrame: VideoFrame): Promise<void> {
        if (!this.device || !this.context || !this.pipeline) {
            throw new Error('Renderer not initialized');
        }

        try {
            // Create texture from video frame
            const texture = this.device.createTexture({
                size: {
                    width: videoFrame.displayWidth,
                    height: videoFrame.displayHeight,
                },
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            });

            // Copy video frame to texture
            this.device.queue.copyExternalImageToTexture(
                { source: videoFrame },
                { texture },
                {
                    width: videoFrame.displayWidth,
                    height: videoFrame.displayHeight,
                }
            );

            // Create sampler
            const sampler = this.device.createSampler({
                magFilter: 'linear',
                minFilter: 'linear',
            });

            // Create bind group
            const bindGroup = this.device.createBindGroup({
                layout: this.pipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: sampler },
                    { binding: 1, resource: texture.createView() },
                ],
            });

            // Create command encoder
            const commandEncoder = this.device.createCommandEncoder();

            const renderPass = commandEncoder.beginRenderPass({
                colorAttachments: [
                    {
                        view: this.context.getCurrentTexture().createView(),
                        loadOp: 'clear',
                        clearValue: { r: 0, g: 0, b: 0, a: 1 },
                        storeOp: 'store',
                    },
                ],
            });

            renderPass.setPipeline(this.pipeline);
            renderPass.setBindGroup(0, bindGroup);
            renderPass.draw(6);
            renderPass.end();

            // Submit commands
            this.device.queue.submit([commandEncoder.finish()]);

            // Clean up
            texture.destroy();
        } catch (error) {
            console.error('❌ Frame rendering failed:', error);
            throw error;
        }
    }

    /**
     * Cleanup resources
     */
    destroy(): void {
        this.device?.destroy();
        this.device = null;
        this.context = null;
        this.pipeline = null;
        this.isInitialized = false;
    }

    /**
     * Check if WebGPU is supported
     */
    static isSupported(): boolean {
        return 'gpu' in navigator;
    }
}
