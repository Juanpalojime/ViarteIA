export interface StylePreset {
    id: string;
    name: string;
    description: string;
    promptEnhancement: string;
    negativePromptEnhancement?: string;
    thumbnail: string;
}

export const STYLE_PRESETS: StylePreset[] = [
    {
        id: 'cinematic',
        name: 'Cinema Pro',
        description: 'Cinematic lighting, 8k, highly detailed, professional grading',
        promptEnhancement: 'cinematic lighting, professional color grading, anamorphic lenses, 8k resolution, highly detailed, masterwork, masterpiece',
        thumbnail: '🎬'
    },
    {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        description: 'Neon lights, futuristic city, rain, synthwave aesthetic',
        promptEnhancement: 'cyberpunk style, neon lights, futuristic city, rainy street, night city, synthwave aesthetic, 8k, vibrant colors',
        thumbnail: '🏙️'
    },
    {
        id: 'anime',
        name: 'Studio Anime',
        description: 'High quality anime style, Ghibli inspired, vibrant colors',
        promptEnhancement: 'high quality anime style, studio ghibli inspired, vibrant colors, hand-drawn look, detailed background, 4k',
        thumbnail: '🏮'
    },
    {
        id: 'fantasy',
        name: 'Epic Fantasy',
        description: 'Majestic landscapes, dragons, magic, Unreal Engine 5 render',
        promptEnhancement: 'epic fantasy, majestic landscape, magic atmosphere, unreal engine 5 render, octane render, photorealistic, intricate detail',
        thumbnail: '🏰'
    },
    {
        id: 'horror',
        name: 'Dark Horror',
        description: 'Spooky lighting, foggy, abandoned, high contrast',
        promptEnhancement: 'dark horror style, spooky lighting, volumetric fog, abandoned location, high contrast, eerie atmosphere, hyper-realistic',
        thumbnail: '💀'
    },
    {
        id: '3d-render',
        name: '3D Pixar',
        description: 'Cute characters, soft lighting, Disney Pixar style',
        promptEnhancement: '3D render, Disney Pixar style, cute characters, soft global illumination, ray tracing, subsurface scattering, 4k',
        thumbnail: '🧸'
    }
];
