import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function GPUIndicator() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const data = await api.health.gpuStatus();
                setStatus(data);
            } catch (err) {
                setStatus({ cuda_available: false, status: 'offline' });
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading) return null;

    const isOnline = status?.cuda_available;

    return (
        <div style={{
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}>
            <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isOnline ? '#00ff88' : '#ff4444',
                boxShadow: isOnline ? '0 0 10px #00ff88' : 'none'
            }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold', color: isOnline ? '#fff' : '#ccc' }}>
                    {isOnline ? 'GPU ONLINE' : 'GPU OFFLINE'}
                </span>
                <span style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.4)' }}>
                    {isOnline ? status.device_name : 'No aceleración detectada'}
                </span>
            </div>
        </div>
    );
}
