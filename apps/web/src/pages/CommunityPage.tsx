import Layout from '../components/Layout';

const COMMUNITY_POSTS = [
    { id: 1, author: 'Alex Chen', avatar: '👨‍🎨', title: 'Cyberpunk City Night', likes: 234, views: 1200, thumbnail: 'https://picsum.photos/seed/comm1/400/225' },
    { id: 2, author: 'Maria Garcia', avatar: '👩‍💻', title: 'Abstract Motion Graphics', likes: 189, views: 890, thumbnail: 'https://picsum.photos/seed/comm2/400/225' },
    { id: 3, author: 'John Smith', avatar: '👨‍🚀', title: 'Space Exploration', likes: 456, views: 2100, thumbnail: 'https://picsum.photos/seed/comm3/400/225' },
    { id: 4, author: 'Sarah Lee', avatar: '👩‍🎤', title: 'Neon Dreams', likes: 312, views: 1500, thumbnail: 'https://picsum.photos/seed/comm4/400/225' },
    { id: 5, author: 'Mike Johnson', avatar: '👨‍🔬', title: 'Tech Interface', likes: 278, views: 1100, thumbnail: 'https://picsum.photos/seed/comm5/400/225' },
    { id: 6, author: 'Emma Wilson', avatar: '👩‍🎨', title: 'Fluid Simulation', likes: 401, views: 1800, thumbnail: 'https://picsum.photos/seed/comm6/400/225' },
];

export default function CommunityPage() {
    return (
        <Layout title="Community" subtitle="Explore videos from the community">
            <div style={{ padding: '2rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {COMMUNITY_POSTS.map(post => (
                        <div
                            key={post.id}
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
                                <img src={post.thumbnail} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    {post.title}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    <span style={{ fontSize: '20px' }}>{post.avatar}</span>
                                    <span style={{ fontSize: '12px', color: '#9c9cba' }}>{post.author}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '12px', color: '#9c9cba' }}>
                                    <span>❤️ {post.likes}</span>
                                    <span>👁️ {post.views}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
