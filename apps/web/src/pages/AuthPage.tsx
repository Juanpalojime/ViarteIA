import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/auth';
import { useNavigate } from 'react-router-dom';
import * as styles from './AuthPage.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    // Auth Store
    const { login, register, isAuthenticated, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    // Redirect if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/generation'); // Redirigir a la app principal
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                await register(email, password, name);
            }
        } catch (err) {
            // Error is handled in store and displayed via `error` state
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.gridBackground} />

            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>ViarteIA</h1>
                    <p className={styles.subtitle}>
                        {isLogin ? 'Welcome back! Log in to continue.' : 'Create your account to start generating.'}
                    </p>
                </div>

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Full Name</label>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input
                            className={styles.input}
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Confirm Password</label>
                            <input
                                className={styles.input}
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <button
                        className={styles.button}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className={styles.footer}>
                    {isLogin ? (
                        <p>
                            Don't have an account?{' '}
                            <span className={styles.link} onClick={() => setIsLogin(false)}>
                                Sign up
                            </span>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <span className={styles.link} onClick={() => setIsLogin(true)}>
                                Sign in
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
