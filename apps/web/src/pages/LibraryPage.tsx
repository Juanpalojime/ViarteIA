import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useGenerationStore } from '../stores/generation';
import * as styles from './LibraryPage.css';

type FilterType = 'all' | 'text-to-video' | 'image-to-video';
type ViewMode = 'grid' | 'list';

export default function LibraryPage() {
    const { jobs, getGenerations } = useGenerationStore();
    const [filter, setFilter] = useState<FilterType>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    useEffect(() => {
        getGenerations();
    }, [getGenerations]);

    const filterAssets = (assets: any[]) => {
        if (filter === 'all') return assets;
        return assets.filter(asset => asset.type === filter);
    };

    const currentAssets = filterAssets(jobs);

    return (
        <Layout title="Library" subtitle="All your generated videos and images">
            <div className={styles.container}>
                {/* Filters */}
                <div className={styles.filtersBar}>
                    <div className={styles.filterButtons}>
                        <button
                            className={filter === 'all' ? styles.filterButtonActive : styles.filterButton}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={filter === 'text-to-video' ? styles.filterButtonActive : styles.filterButton}
                            onClick={() => setFilter('text-to-video')}
                        >
                            🎬 Videos (T2V)
                        </button>
                        <button
                            className={filter === 'image-to-video' ? styles.filterButtonActive : styles.filterButton}
                            onClick={() => setFilter('image-to-video')}
                        >
                            🖼️ Images (I2V)
                        </button>
                    </div>

                    <div className={styles.viewToggle}>
                        <button
                            className={viewMode === 'grid' ? styles.viewButtonActive : styles.viewButton}
                            onClick={() => setViewMode('grid')}
                        >
                            ⊞
                        </button>
                        <button
                            className={viewMode === 'list' ? styles.viewButtonActive : styles.viewButton}
                            onClick={() => setViewMode('list')}
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {currentAssets.length > 0 ? (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h3 className={styles.sectionTitle}>Recently Generated</h3>
                                <span className={styles.sectionCount}>{currentAssets.length} items</span>
                            </div>

                            <div className={styles.grid}>
                                {currentAssets.map(job => (
                                    <AssetCard key={job.id} job={job} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '100px 0', color: '#555566' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>Empty</div>
                            <p>No has generado nada aún. ¡Ven a crear algo!</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

// Asset Card Component
function AssetCard({ job }: { job: any }) {
    const isProcessing = job.status === 'processing' || job.status === 'pending';

    return (
        <div className={styles.card}>
            {/* Thumbnail */}
            <div className={styles.cardThumbnail}>
                {isProcessing ? (
                    <div className={styles.processingState}>
                        <div className={styles.spinner} />
                        <span className={styles.processingText}>GENERATING... {job.progress}%</span>
                    </div>
                ) : (
                    <>
                        {job.resultUrl ? (
                            <video src={job.resultUrl} className={styles.cardImage} muted onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />
                        ) : (
                            <div className={styles.cardImage} style={{ background: '#282839', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                📷 No Preview
                            </div>
                        )}
                    </>
                )}

                {/* Badges */}
                <div className={styles.badges}>
                    <span className={styles.aiBadge}>✨ AI</span>
                    <span className={styles.imageBadge}>{job.type === 'text-to-video' ? 'TXT' : 'IMG'}</span>
                </div>

                {/* Hover Actions */}
                {!isProcessing && job.resultUrl && (
                    <div className={styles.hoverActions}>
                        <a href={job.resultUrl} target="_blank" rel="noreferrer" className={styles.actionButton} title="Download">⬇️</a>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className={styles.cardInfo}>
                <div className={styles.cardContent}>
                    <h4 className={styles.cardTitle} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {job.prompt}
                    </h4>

                    {isProcessing ? (
                        <div className={styles.progressContainer}>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${job.progress}%` }} />
                            </div>
                        </div>
                    ) : (
                        <p className={styles.cardMeta}>
                            {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
