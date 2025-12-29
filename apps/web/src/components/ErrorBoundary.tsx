import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: undefined,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0f',
                    color: '#ffffff',
                    fontFamily: 'sans-serif',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '3rem', margin: '0 0 1rem', color: '#5555f6' }}>🎬 Algo salió mal...</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#9c9cba', maxWidth: '500px' }}>
                        Pero no te preocupes, ya lo estamos arreglando para que puedas seguir creando magia.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.8rem 2rem',
                            backgroundColor: '#5555f6',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6666f7'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5555f6'}
                    >
                        Recargar Aplicación
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <pre style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            backgroundColor: '#1a1a20',
                            borderRadius: '8px',
                            maxWidth: '100%',
                            overflow: 'auto',
                            fontSize: '0.8rem',
                            color: '#ff4444'
                        }}>
                            {this.state.error.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        // ✅ CORREGIDO: usa this.props.children
        return this.props.children;
    }
}

export default ErrorBoundary;