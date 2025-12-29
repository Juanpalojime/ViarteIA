import { Clip } from '../stores/editor';

// Simulated Semantic Analysis for "Intelligent" suggestions
// In a real implementation, this would call a Python backend with CLIP/BLIP models.
export const analyzeContent = async (_clip: Clip): Promise<string[]> => {
    // Mock: Deterministic "analysis" based on filename or random hash
    const tags = ['nature', 'urban', 'action', 'static', 'dark', 'bright'];
    // Return random tags for demo
    return [tags[Math.floor(Math.random() * tags.length)]];
};

export const suggestTransition = async (prevClip: Clip | undefined, nextClip: Clip): Promise<'fade' | 'slide' | 'zoom' | 'wipe' | 'glitch'> => {
    if (!prevClip) return 'fade';

    // Simulate AI Latency
    await new Promise(r => setTimeout(r, 600));

    // Logic based on "semantic" tags
    const prevTags = await analyzeContent(prevClip);
    const nextTags = await analyzeContent(nextClip);

    console.log(`🤖 AI Analysis: ${prevClip.name} [${prevTags}] -> ${nextClip.name} [${nextTags}]`);

    if (prevTags.includes('action') || nextTags.includes('action')) {
        return 'glitch'; // Fast cuts for action
    }

    if (prevTags.includes('nature') && nextTags.includes('nature')) {
        return 'fade'; // Smooth for nature
    }

    if (prevTags.includes('urban')) {
        return 'slide'; // Dynamic for urban
    }

    return 'zoom'; // Default dynamic
};
