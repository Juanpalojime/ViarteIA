import Layout from '../components/Layout';

const FAVORITES = [
    { id: 1, title: 'Sunset Timelapse', type: 'video', thumbnail: 'https://picsum.photos/seed/fav1/400/225', duration: '02:30' },
    { id: 2, title: 'Abstract Art', type: 'image', thumbnail: 'https://picsum.photos/seed/fav2/400/225' },
    { id: 3, title: 'City Lights', type: 'video', thumbnail: 'https://picsum.photos/seed/fav3/400/225', duration: '01:45' },
    { id: 4, title: 'Nature Scene', type: 'image', thumbnail: 'https://picsum.photos/seed/fav4/400/225' },
];

export default function FavoritesPage() {
    return (
        <Layout title="Favorites" subtitle="Your favorite videos and images">
            <div style={{ padding: '2rem' }}>
                {FAVORITES.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem',
                    }}>
                        {FAVORITES.map(item => (
                            <div
                                key={item.id}
                                style={{
                                    backgroundColor: '#1a1a20',
                                    borderRadius: '12px',
                                    border: '1px solid #282839',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ aspectRatio: '16/9', position: 'relative' }}>
                                    <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {item.duration && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '8px',
                                            right: '8px',
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                        }}>
                                            {item.duration}
                                        </div>
                                    )}
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        left: '8px',
                                        backgroundColor: '#ef4444',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                    }}>
                                        ❤️
                                    </div>
                                </div>
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600' }}>{item.title}</h3>
                                    <p style={{ fontSize: '12px', color: '#9c9cba', marginTop: '4px' }}>
                                        {item.type === 'video' ? '🎬 Video' : '🖼️ Image'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        padding: '4rem',
                        textAlign: 'center',
                        backgroundColor: '#1a1a20',
                        borderRadius: '12px',
                        border: '1px dashed #282839',
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '1rem' }}>❤️</div>
                        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '0.5rem' }}>No favorites yet</h2>
                        <p style={{ color: '#9c9cba' }}>Start adding videos and images to your favorites</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
