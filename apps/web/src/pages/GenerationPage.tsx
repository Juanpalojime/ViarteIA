import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGenerationStore } from '../stores/generation';
import { api } from '../services/api';
import { STYLE_PRESETS } from '../services/styles';
import Layout from '../components/Layout';
import * as styles from './GenerationPage.css';

export default function GenerationPage() {
    const {
        mode,
        prompt,
        imageUrl,
        settings,
        jobs,
        isGenerating,
        setMode,
        setPrompt,
        setNegativePrompt,
        setImageUrl,
        faceImageUrl,
        setFaceImageUrl,
        updateSettings,
        resetSettings,
        startGeneration,
        getGenerations,
        magicPrompt,
        selectedStyleId,
        setSelectedStyle,
        connectWs
    } = useGenerationStore();

    const [negativePromptInput, setNegativePromptInput] = useState('');
    const [seed, setSeed] = useState(-1);
    const [isUploading, setIsUploading] = useState(false);
    const [isFaceUploading, setIsFaceUploading] = useState(false);

    useEffect(() => {
        connectWs();
        getGenerations();
    }, [connectWs, getGenerations]);

    const handleNegativePromptChange = (val: string) => {
        setNegativePromptInput(val);
        setNegativePrompt(val);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await api.assets.upload(file);
            setImageUrl(url);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleGenerate = async () => {
        if (isGenerating) return;
        try {
            await startGeneration();
        } catch (error) {
            console.error('Generation failed:', error);
        }
    };

    const handleRandomSeed = () => {
        setSeed(Math.floor(Math.random() * 1000000));
    };

    const latestJob = jobs[0];

    return (
        <Layout title="AI Video Generation" subtitle="Create stunning cinematic videos with AI">
            <div className={styles.container}>
                <div className={styles.studioHeader}>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.headerTitle}>Generación AI Studio</h1>
                        <p className={styles.headerSubtitle}>Crea video cinematográfico con control multimodal</p>
                    </div>

                    <div className={styles.modeToggle}>
                        <button
                            className={mode === 'text-to-video' ? styles.modeButtonActive : styles.modeButton}
                            onClick={() => setMode('text-to-video')}
                        >
                            <span>📝</span>
                            Texto a Video
                        </button>
                        <button
                            className={mode === 'image-to-video' ? styles.modeButtonActive : styles.modeButton}
                            onClick={() => setMode('image-to-video')}
                        >
                            <span>🖼️</span>
                            Imagen a Video
                        </button>
                    </div>
                </div>

                <div className={styles.mainContent}>
                    <div className={styles.controlsPanel}>
                        <div className={styles.controlsContent}>

                            {/* Image Upload for Image-to-Video */}
                            {mode === 'image-to-video' && (
                                <div className={styles.formGroup}>
                                    <div className={styles.label}>
                                        <span>Imagen de Referencia</span>
                                    </div>
                                    <div
                                        style={{
                                            border: '2px dashed #282839',
                                            borderRadius: '12px',
                                            padding: '20px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: 'rgba(0,0,0,0.2)',
                                            transition: 'all 0.2s',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                    >
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                        {isUploading ? (
                                            <span style={{ color: '#5555f6', fontSize: '12px' }}>Subiendo...</span>
                                        ) : imageUrl ? (
                                            <div style={{ position: 'relative' }}>
                                                <img
                                                    src={imageUrl}
                                                    alt="Reference"
                                                    style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'rgba(0,0,0,0.4)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s',
                                                }}
                                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                                >
                                                    <span style={{ color: 'white', fontSize: '12px' }}>Cambiar imagen</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '24px' }}>📁</span>
                                                <span style={{ color: '#555566', fontSize: '12px' }}>Click para subir imagen</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* FaceSwap Section */}
                            <div className={styles.formGroup}>
                                <div className={styles.label}>
                                    <span>FaceSwap (Referencia de rostro)</span>
                                </div>
                                <div
                                    style={{
                                        border: faceImageUrl ? '2px solid #5555f6' : '2px dashed #282839',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                    }}
                                    onClick={() => document.getElementById('face-upload')?.click()}
                                >
                                    <input
                                        id="face-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setIsFaceUploading(true);
                                            try {
                                                const url = await api.assets.upload(file);
                                                setFaceImageUrl(url);
                                            } catch (err) {
                                                console.error(err);
                                            } finally {
                                                setIsFaceUploading(false);
                                            }
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                    {isFaceUploading ? (
                                        <span style={{ color: '#5555f6', fontSize: '11px' }}>Subiendo rostro...</span>
                                    ) : faceImageUrl ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                            <img src={faceImageUrl} alt="Face" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                            <span style={{ fontSize: '11px', color: '#555566' }}>Rostro listo. Click para cambiar.</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setFaceImageUrl(null); }}
                                                style={{ background: 'none', border: 'none', color: '#ff4444', fontSize: '14px', cursor: 'pointer' }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '18px' }}>👤</span>
                                            <span style={{ color: '#555566', fontSize: '11px' }}>Subir rostro para FaceSwap (Opcional)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <div className={styles.label}>
                                    <span>Prompt Positivo</span>
                                    <button
                                        className={styles.magicButton}
                                        onClick={() => magicPrompt()}
                                        type="button"
                                    >
                                        ✨ Magic Prompt
                                    </button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <textarea
                                        className={styles.textarea}
                                        placeholder="Describe tu visión... ej. Un astronauta caminando por un desierto de neón, cinematográfico, 4k, iluminación volumétrica..."
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '8px',
                                        right: '8px',
                                        fontSize: '10px',
                                        color: '#555566'
                                    }}>
                                        {prompt.length}/1000
                                    </div>
                                </div>
                            </div>

                            {/* Negative Prompt */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Prompt Negativo</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    placeholder="Borrosa, baja calidad, deformado..."
                                    value={negativePromptInput}
                                    onChange={(e) => handleNegativePromptChange(e.target.value)}
                                />
                            </div>

                            <div className={styles.divider} />

                            {/* Style Presets */}
                            <div className={styles.formGroup}>
                                <div className={styles.label}>
                                    <span>Estilo Visual</span>
                                    {selectedStyleId && (
                                        <button
                                            onClick={() => setSelectedStyle(null)}
                                            style={{ color: '#ff4444', fontSize: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            Limpiar
                                        </button>
                                    )}
                                </div>
                                <div className={styles.styleGrid}>
                                    {STYLE_PRESETS.map(style => (
                                        <div
                                            key={style.id}
                                            className={selectedStyleId === style.id ? styles.styleCardActive : styles.styleCard}
                                            onClick={() => setSelectedStyle(style.id)}
                                        >
                                            <span className={styles.styleIcon}>{style.thumbnail}</span>
                                            <span className={styles.styleName}>{style.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.divider} />

                            {/* Settings Section */}
                            <div className={styles.formGroup}>
                                <div className={styles.sectionTitle}>
                                    <span>Configuración de Video</span>
                                    <button
                                        onClick={() => resetSettings()}
                                        style={{ fontSize: '12px', color: '#9c9cba', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Resetear
                                    </button>
                                </div>

                                {/* Aspect Ratio */}
                                <div className={styles.formGroup}>
                                    <span className={styles.label}>Relación de Aspecto</span>
                                    <div className={styles.aspectRatioGrid}>
                                        <AspectRatioButton
                                            label="16:9"
                                            active={settings.aspectRatio === '16:9'}
                                            onClick={() => updateSettings({ aspectRatio: '16:9' })}
                                        >
                                            <div style={{ width: '24px', height: '12px', border: '2px solid currentColor', borderRadius: '1px' }} />
                                        </AspectRatioButton>
                                        <AspectRatioButton
                                            label="9:16"
                                            active={settings.aspectRatio === '9:16'}
                                            onClick={() => updateSettings({ aspectRatio: '9:16' })}
                                        >
                                            <div style={{ width: '12px', height: '20px', border: '2px solid currentColor', borderRadius: '1px' }} />
                                        </AspectRatioButton>
                                        <AspectRatioButton
                                            label="1:1"
                                            active={settings.aspectRatio === '1:1'}
                                            onClick={() => updateSettings({ aspectRatio: '1:1' })}
                                        >
                                            <div style={{ width: '16px', height: '16px', border: '2px solid currentColor', borderRadius: '1px' }} />
                                        </AspectRatioButton>
                                        <AspectRatioButton
                                            label="4:3"
                                            active={settings.aspectRatio === '4:3'}
                                            onClick={() => updateSettings({ aspectRatio: '4:3' })}
                                        >
                                            <div style={{ width: '20px', height: '15px', border: '2px solid currentColor', borderRadius: '1px' }} />
                                        </AspectRatioButton>
                                    </div>
                                </div>

                                {/* Upscale Toggle */}
                                <div className={styles.formGroup}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span className={styles.label}>Upscale (Hires x2)</span>
                                        <button
                                            onClick={() => updateSettings({ upscale: !settings.upscale })}
                                            style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '10px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                backgroundColor: settings.upscale ? '#5555f6' : '#282839',
                                                color: 'white',
                                                border: 'none',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {settings.upscale ? 'ACTIVADO' : 'DESACTIVADO'}
                                        </button>
                                    </div>
                                    <p style={{ fontSize: '10px', color: '#555566', marginTop: '4px' }}>
                                        Aumenta resolución y detalle usando Real-ESRGAN. Aumenta el tiempo de generación.
                                    </p>
                                </div>

                                {/* Sliders */}
                                <div className={styles.sliderGroup}>
                                    <div className={styles.sliderContainer}>
                                        <div className={styles.sliderLabel}>
                                            <span className={styles.sliderLabelText}>Duración</span>
                                            <span className={styles.sliderValue}>{settings.duration}s</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="2"
                                            max="30"
                                            value={settings.duration}
                                            onChange={(e) => updateSettings({ duration: Number(e.target.value) })}
                                            className={styles.slider}
                                        />
                                    </div>

                                    <div className={styles.sliderContainer}>
                                        <div className={styles.sliderLabel}>
                                            <span className={styles.sliderLabelText}>FPS</span>
                                            <span className={styles.sliderValue}>{settings.fps}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="24"
                                            max="60"
                                            value={settings.fps}
                                            onChange={(e) => updateSettings({ fps: Number(e.target.value) })}
                                            className={styles.slider}
                                        />
                                    </div>
                                </div>

                                {/* Seed */}
                                <div className={styles.formGroup}>
                                    <span className={styles.label}>Seed (Semilla)</span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            className={styles.input}
                                            type="number"
                                            placeholder="-1 (Aleatorio)"
                                            value={seed === -1 ? '' : seed}
                                            onChange={(e) => setSeed(Number(e.target.value) || -1)}
                                        />
                                        <button
                                            onClick={handleRandomSeed}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '8px',
                                                backgroundColor: '#282839',
                                                color: '#9c9cba',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            🎲
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Generate Button */}
                            <div style={{ position: 'sticky', bottom: 0, paddingTop: '16px', borderTop: '1px solid #282839', marginTop: 'auto' }}>
                                <button ref={null} className={styles.generateButton} onClick={handleGenerate} disabled={isGenerating}>
                                    <span>{isGenerating ? '⏳' : '🎬'}</span>
                                    {isGenerating ? 'Generando...' : 'Generar Video'}
                                    <span style={{
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        fontSize: '10px',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        marginLeft: '4px',
                                        fontFamily: 'monospace'
                                    }}>
                                        15 CR
                                    </span>
                                </button>
                                <p style={{
                                    textAlign: 'center',
                                    fontSize: '10px',
                                    color: '#555566',
                                    marginTop: '8px'
                                }}>
                                    Tiempo estimado: ~45 segundos
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.previewPanel}>
                        <div className={styles.previewPlayer}>
                            {latestJob?.resultUrl ? (
                                <video
                                    src={latestJob.resultUrl}
                                    controls
                                    autoPlay
                                    loop
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <>
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
                                        opacity: 0.8,
                                    }} />
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundImage: 'radial-gradient(#282839 1px, transparent 1px)',
                                        backgroundSize: '20px 20px',
                                        opacity: 0.2,
                                    }} />
                                    <div className={styles.previewPlaceholder}>
                                        <div className={styles.playIcon}>
                                            {isGenerating ? '⏳' : '▶️'}
                                        </div>
                                        <p style={{ color: '#9c9cba', fontWeight: 500, fontSize: '18px' }}>
                                            {isGenerating ? 'Creando tu magia...' : 'Tu obra maestra aparecerá aquí'}
                                        </p>
                                        {isGenerating && latestJob && (
                                            <div style={{ width: '200px', marginTop: '16px' }}>
                                                <div style={{
                                                    width: '100%',
                                                    height: '4px',
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                    borderRadius: '2px',
                                                    overflow: 'hidden',
                                                    marginBottom: '8px'
                                                }}>
                                                    <div style={{
                                                        width: `${latestJob.progress}%`,
                                                        height: '100%',
                                                        backgroundColor: '#5555f6',
                                                        boxShadow: '0 0 10px #5555f6',
                                                        transition: 'width 0.3s ease-out'
                                                    }} />
                                                </div>
                                                <p style={{ color: '#555566', fontSize: '11px', fontWeight: 600 }}>
                                                    {latestJob.status === 'processing' ? 'Procesando Frames...' : 'Iniciando IA...'} {latestJob.progress}%
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className={styles.historySection}>
                            <div className={styles.historyHeader}>
                                <h3 className={styles.historyTitle}>
                                    <span>🕒</span>
                                    Recientes
                                </h3>
                                <Link to="/library" style={{ fontSize: '12px', color: '#5555f6', textDecoration: 'none' }}>Ver todos</Link>
                            </div>

                            <div className={styles.historyGrid}>
                                {jobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className={job.status === 'processing' || job.status === 'pending' ? styles.historyCardGenerating : styles.historyCard}
                                    >
                                        {job.status === 'processing' || job.status === 'pending' ? (
                                            <>
                                                <div style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    border: '2px solid #5555f6',
                                                    borderTopColor: 'transparent',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite',
                                                }} />
                                                <span style={{ fontSize: '10px', color: '#5555f6', fontWeight: 500 }}>
                                                    Generando... {job.progress}%
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <video
                                                    src={job.resultUrl || ''}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    muted
                                                    onMouseOver={e => e.currentTarget.play()}
                                                    onMouseOut={e => e.currentTarget.pause()}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '4px',
                                                    right: '8px',
                                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                                    borderRadius: '4px',
                                                    padding: '2px 6px',
                                                    fontSize: '10px',
                                                    color: 'white',
                                                    backdropFilter: 'blur(4px)',
                                                }}>
                                                    {job.type === 'text-to-video' ? 'TXT' : 'IMG'}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Aspect Ratio Button Component
interface AspectRatioButtonProps {
    label: string;
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

function AspectRatioButton({ label, active, onClick, children }: AspectRatioButtonProps) {
    return (
        <button
            onClick={onClick}
            className={active ? styles.aspectRatioButtonActive : styles.aspectRatioButton}
        >
            {children}
            <span style={{ fontSize: '10px', fontWeight: 500 }}>{label}</span>
        </button>
    );
}
