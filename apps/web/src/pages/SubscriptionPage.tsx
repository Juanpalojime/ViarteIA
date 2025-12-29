import Layout from '../components/Layout';

const PLANS = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        features: ['15 credits/month', 'Basic quality', '720p resolution', 'Community support'],
        current: true,
    },
    {
        name: 'Pro',
        price: '$29',
        period: 'per month',
        features: ['500 credits/month', 'High quality', '4K resolution', 'Priority support', 'Commercial license'],
        popular: true,
    },
    {
        name: 'Enterprise',
        price: '$99',
        period: 'per month',
        features: ['Unlimited credits', 'Ultra quality', '8K resolution', 'Dedicated support', 'API access', 'Custom models'],
    },
];

export default function SubscriptionPage() {
    return (
        <Layout title="Subscription" subtitle="Choose the perfect plan for you">
            <div style={{ padding: '2rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}>
                    {PLANS.map(plan => (
                        <div
                            key={plan.name}
                            style={{
                                padding: '2rem',
                                backgroundColor: '#1a1a20',
                                borderRadius: '16px',
                                border: plan.popular ? '2px solid #5555f6' : '1px solid #282839',
                                position: 'relative',
                            }}
                        >
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: '#5555f6',
                                    padding: '4px 16px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                }}>
                                    ⭐ Most Popular
                                </div>
                            )}

                            {plan.current && (
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    backgroundColor: '#10b981',
                                    padding: '4px 12px',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                }}>
                                    Current Plan
                                </div>
                            )}

                            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                {plan.name}
                            </h3>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '36px', fontWeight: 'bold' }}>{plan.price}</span>
                                <span style={{ fontSize: '14px', color: '#9c9cba', marginLeft: '0.5rem' }}>
                                    {plan.period}
                                </span>
                            </div>

                            <ul style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px' }}>
                                        <span style={{ color: '#10b981' }}>✓</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: plan.popular ? '#5555f6' : '#282839',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = plan.popular ? '#6666f7' : '#323246'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = plan.popular ? '#5555f6' : '#282839'}
                            >
                                {plan.current ? 'Current Plan' : 'Upgrade'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
