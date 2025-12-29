import Layout from '../components/Layout';

const TEMPLATES = [
    { id: 1, name: 'Cinematic Intro', category: 'Intros', thumbnail: 'https://picsum.photos/seed/template1/400/225', duration: '0:05' },
    { id: 2, name: 'Product Showcase', category: 'Marketing', thumbnail: 'https://picsum.photos/seed/template2/400/225', duration: '0:15' },
    { id: 3, name: 'Social Media Story', category: 'Social', thumbnail: 'https://picsum.photos/seed/template3/400/225', duration: '0:10' },
    { id: 4, name: 'Logo Reveal', category: 'Branding', thumbnail: 'https://picsum.photos/seed/template4/400/225', duration: '0:08' },
    { id: 5, name: 'Tech Presentation', category: 'Business', thumbnail: 'https://picsum.photos/seed/template5/400/225', duration: '0:20' },
    { id: 6, name: 'Event Promo', category: 'Events', thumbnail: 'https://picsum.photos/seed/template6/400/225', duration: '0:12' },
];

export default function TemplatesPage() {
    return (
        <Layout title="Video Templates" subtitle="Start with professional templates">
            <div style={{ padding: '2rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {TEMPLATES.map(template => (
                        <div
                            key={template.id}
                            style={{
                                backgroundColor: '#1a1a20',
                                borderRadius: '12px',
                                border: '1px solid #282839',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#5555f6'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#282839'}
                        >
                            <div style={{ aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
                                <img
                                    src={template.thumbnail}
                                    alt={template.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '8px',
                                    right: '8px',
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontFamily: 'monospace',
                                }}>
                                    {template.duration}
                                </div>
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '0.25rem' }}>
                                    {template.name}
                                </h3>
                                <p style={{ fontSize: '12px', color: '#9c9cba' }}>{template.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
