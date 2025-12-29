import Layout from '../components/Layout';
import { useAuthStore } from '../stores/auth';

export default function ProfilePage() {
    const { user } = useAuthStore();

    return (
        <Layout title="Profile" subtitle="Manage your profile information">
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                    backgroundColor: '#1a1a20',
                    borderRadius: '16px',
                    border: '1px solid #282839',
                    padding: '2rem',
                }}>
                    {/* Avatar Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #5555f6 0%, #8b5cf6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '48px',
                            fontWeight: 'bold',
                        }}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                {user?.name || 'Demo User'}
                            </h2>
                            <p style={{ color: '#9c9cba', marginBottom: '0.5rem' }}>
                                {user?.email || 'demo@viarteia.com'}
                            </p>
                            <div style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                backgroundColor: '#5555f6',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                            }}>
                                {user?.plan || 'Free'} Plan
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        marginBottom: '2rem',
                    }}>
                        <StatCard icon="🎬" label="Videos Created" value="12" />
                        <StatCard icon="⭐" label="Favorites" value="8" />
                        <StatCard icon="💎" label="Credits Left" value="15" />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#5555f6',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}>
                            Edit Profile
                        </button>
                        <button style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#282839',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}>
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div style={{
            padding: '1rem',
            backgroundColor: '#111118',
            borderRadius: '12px',
            border: '1px solid #282839',
            textAlign: 'center',
        }}>
            <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '0.25rem' }}>{value}</div>
            <div style={{ fontSize: '12px', color: '#9c9cba' }}>{label}</div>
        </div>
    );
}
