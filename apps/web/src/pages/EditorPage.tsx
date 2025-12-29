import { useRef, useEffect } from 'react';
import { useEditorStore } from '../stores/editor';
import { useGenerationStore } from '../stores/generation';
import * as styles from './EditorPage.css';
import { suggestTransition } from '../services/smartTransitions';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { Clip, Effect } from '../stores/editor';

export default function EditorPage() {
    // Editor State
    const {
        tracks,
        currentTime,
        totalDuration,
        zoom,
        isPlaying,
        addClip,
        updateClip,
        setPlayhead,
        setPlaying
    } = useEditorStore();

    // Assets (Completed Generations)
    const { jobs } = useGenerationStore();
    const assets = jobs.filter(j => j.status === 'completed' && j.resultUrl);

    // Refs
    const timelineRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    const startTimeRef = useRef<number>(0);

    // Playback Loop
    useEffect(() => {
        if (isPlaying) {
            const animate = (time: number) => {
                // const delta = (time - startTimeRef.current) / 1000;
                // Simple playhead advancement simulation. 
                // In a real app, this would be synced to an audio context or video element.
                if (currentTime < totalDuration) {
                    setPlayhead(currentTime + 0.016); // ~60fps advancement
                    requestRef.current = requestAnimationFrame(animate);
                } else {
                    setPlaying(false);
                }
            };
            startTimeRef.current = performance.now();
            requestRef.current = requestAnimationFrame(animate);
        } else if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying, currentTime, totalDuration, setPlayhead, setPlaying]);

    // Handle Play/Pause
    const togglePlay = () => {
        setPlaying(!isPlaying);
    };

    // Add Asset to Timeline
    const handleAddToTimeline = (job: any) => {
        // Find first video track or create one
        const trackId = tracks.find(t => t.type === 'video')?.id || 'track-1';

        // Find end of last clip to append
        const trackClips = tracks.find(t => t.id === trackId)?.clips || [];
        const lastClipEnd = trackClips.length > 0
            ? Math.max(...trackClips.map(c => c.start + c.duration))
            : 0;

        addClip(trackId, {
            type: 'video',
            src: job.resultUrl,
            name: job.prompt.slice(0, 20) + '...',
            duration: 5, // Default duration, ideally get from video metadata
            start: lastClipEnd
        });
    };

    // Calculate timeline width
    const timelineWidth = totalDuration * zoom;

    // Find active clip at current time for preview
    const activeVideoClip = tracks
        .filter(t => t.type === 'video')
        .flatMap(t => t.clips)
        .find(c => currentTime >= c.start && currentTime < c.start + c.duration);

    // Apply Effects to Preview Style
    const getPreviewStyle = (clip: Clip | undefined) => {
        if (!clip || !clip.effects) return {};
        const filterString = clip.effects.map(e => {
            if (e.type === 'filter') return e.value; // e.g., 'sepia(1)'
            return '';
        }).join(' ');
        return { filter: filterString };
    };

    // Smart Transition Handler
    const [isThinking, setIsThinking] = useState(false);

    const handleSmartTransitions = async () => {
        setIsThinking(true);
        const videoTrack = tracks.find(t => t.type === 'video');
        if (!videoTrack) return;

        // Iterate clips and suggest transitions
        // Note: we can't await inside map easily, so use for-of loop logic or Promise.all
        // For simple interaction, we'll just do it for the currently selected clip or all
        // Let's do it for all clips to show the "Magic"

        const updates = await Promise.all(videoTrack.clips.map(async (clip, index) => {
            if (index === 0) return null; // Skip first clip
            const prevClip = videoTrack.clips[index - 1];
            const suggestion = await suggestTransition(prevClip, clip);
            return { id: clip.id, transition: { type: suggestion, duration: 1.0 } };
        }));

        updates.forEach(u => {
            if (u) {
                // @ts-ignore - TS might complain about partial update structure mismatch with strict typing, but store handles it
                updateClip(u.id, { transition: u.transition });
            }
        });

        setIsThinking(false);
    };

    const addEffect = (type: 'filter', name: string, value: string) => {
        if (!activeVideoClip) return;
        const newEffect: Effect = { id: uuidv4(), type, name, value };
        const currentEffects = activeVideoClip.effects || [];
        updateClip(activeVideoClip.id, { effects: [...currentEffects, newEffect] });
    };


    return (
        <div className={styles.editorLayout}>
            {/* Header */}
            <div className={styles.header}>
                <div style={{ fontWeight: 'bold' }}>Viarte Editor</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className={styles.button}
                        onClick={handleSmartTransitions}
                        disabled={isThinking}
                        style={{ background: 'linear-gradient(45deg, #7928ca, #ff0080)', border: 'none' }}
                    >
                        {isThinking ? '✨ Analyzing...' : '✨ Magic Transitions'}
                    </button>
                    <button className={styles.buttonPrimary}>Export Video</button>
                </div>
            </div>

            {/* Main Area */}
            <div className={styles.mainSection}>
                {/* Browser Panel */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>Assets Library</div>
                    <div className={styles.assetGrid}>
                        {assets.length === 0 && (
                            <div style={{ padding: '20px', color: '#555', fontSize: '12px', gridColumn: '1/-1', textAlign: 'center' }}>
                                No generated videos yet. Go to Generation Studio to create some!
                            </div>
                        )}
                        {assets.map(asset => (
                            <div key={asset.id} className={styles.assetCard} onClick={() => handleAddToTimeline(asset)}>
                                <video src={asset.resultUrl} className={styles.assetThumbnail} />
                                <div style={{ padding: '4px', fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {asset.prompt}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preview Panel */}
                <div className={styles.previewContainer}>
                    {activeVideoClip ? (
                        <video
                            src={activeVideoClip.src}
                            muted
                            style={{
                                maxWidth: '100%',
                                maxHeight: '400px',
                                ...getPreviewStyle(activeVideoClip),
                                transition: 'filter 0.3s ease'
                            }}
                        />
                    ) : (
                        <div style={{ color: '#555', fontSize: '14px' }}>No clip at playhead</div>
                    )}
                    <div style={{ marginTop: '10px', color: 'white', fontFamily: 'monospace' }}>
                        {currentTime.toFixed(2)}s / {totalDuration.toFixed(2)}s
                    </div>
                </div>

                {/* Effects Panel */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>Effects</div>
                    {activeVideoClip ? (
                        <div style={{ padding: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button onClick={() => addEffect('filter', 'B&W', 'grayscale(1)')} className={styles.button}>B&W</button>
                            <button onClick={() => addEffect('filter', 'Sepia', 'sepia(1)')} className={styles.button}>Sepia</button>
                            <button onClick={() => addEffect('filter', 'Contrast', 'contrast(1.5)')} className={styles.button}>Contrast</button>
                            <button onClick={() => addEffect('filter', 'Vintage', 'sepia(0.5) contrast(1.2)')} className={styles.button}>Vintage</button>
                            <button onClick={() => addEffect('filter', 'Cyber', 'saturate(200%) contrast(1.2)')} className={styles.button}>Cyber</button>

                            {activeVideoClip.transition && (
                                <div style={{ marginTop: '10px', width: '100%', fontSize: '12px', color: '#aaa' }}>
                                    Active Transition: <span style={{ color: '#fff' }}>{activeVideoClip.transition.type}</span> ({activeVideoClip.transition.duration}s)
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ padding: '10px', color: '#555', fontSize: '12px' }}>
                            Select a clip to add effects
                        </div>
                    )}
                </div>
            </div>

            {/* Timeline Area */}
            <div className={styles.timelineContainer}>
                <div className={styles.timelineToolbar}>
                    <button className={styles.button} onClick={togglePlay}>
                        {isPlaying ? '⏸ Pause' : '▶ Play'}
                    </button>
                    <input
                        type="range"
                        min="1" max="100"
                        value={zoom}
                        onChange={(e) => useEditorStore.getState().setZoom(Number(e.target.value))}
                        style={{ width: '100px' }}
                    />
                </div>

                <div className={styles.timelineTracks} ref={timelineRef}>
                    {/* Ruler */}
                    <div className={styles.ruler} style={{ width: `${timelineWidth}px` }}>
                        {/* Ticks would go here */}
                    </div>

                    {/* Tracks */}
                    {tracks.map(track => (
                        <div key={track.id} className={styles.track} style={{ width: `${timelineWidth}px` }}>
                            <div className={styles.trackHeader}>
                                {track.name}
                            </div>
                            <div className={styles.trackContent}
                                onClick={(e) => {
                                    // Click to seek
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX - rect.left + e.currentTarget.scrollLeft;
                                    setPlayhead(x / zoom);
                                }}
                            >
                                {track.clips.map(clip => (
                                    <div
                                        key={clip.id}
                                        className={styles.clip}
                                        style={{
                                            left: `${clip.start * zoom}px`,
                                            width: `${clip.duration * zoom}px`,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            useEditorStore.getState().selectClip(clip.id);
                                        }}
                                    >
                                        {clip.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Playhead Line */}
                    <div
                        className={styles.playhead}
                        style={{ left: `${currentTime * zoom + 120}px` }} // +120 for track header width
                    />
                </div>
            </div>
        </div >
    );
}
