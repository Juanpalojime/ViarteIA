import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { darkTheme } from './styles/theme.css';
import * as styles from './App.css';
import { useAuthStore } from './stores/auth';
import ErrorBoundary from './components/ErrorBoundary';

// Pages - Lazy Models
const AuthPage = lazy(() => import('./pages/AuthPage'));
const GenerationPage = lazy(() => import('./pages/GenerationPage'));
const EditorPage = lazy(() => import('./pages/EditorPage'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Loading Screen Component
const PageLoader = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0a0a0f',
        color: '#5555f6'
    }}>
        Loading ViarteIA...
    </div>
);

function RequireAuth({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
}

function App() {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <ErrorBoundary>
            <div className={`${darkTheme} ${styles.app}`}>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Public Routes (Desactivadas - redirigen al estudio) */}
                        <Route path="/auth" element={<Navigate to="/generation" replace />} />

                        {/* Protected Routes (Now Public for easier testing) */}
                        <Route path="/" element={<Navigate to="/generation" replace />} />

                        <Route path="/generation" element={<GenerationPage />} />
                        <Route path="/editor" element={<EditorPage />} />
                        <Route path="/templates" element={<TemplatesPage />} />
                        <Route path="/library" element={<LibraryPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/subscription" element={<SubscriptionPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </Suspense>
            </div>
        </ErrorBoundary>
    );
}

export default App;
