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
    const [formError, setFormError] = useState('');

    const { login, register, isAuthenticated, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/generation');
        }
    }, [isAuthenticated, navigate]);

    // Validación en tiempo real de la contraseña (solo en registro)
    useEffect(() => {
        if (!isLogin && password) {
            if (password.length < 8) {
                setFormError('La contraseña debe tener al menos 8 caracteres');
            } else if (!/[A-Z]/.test(password)) {
                setFormError('La contraseña debe incluir al menos una letra mayúscula');
            } else if (!/[0-9]/.test(password)) {
                setFormError('La contraseña debe incluir al menos un número');
            } else {
                setFormError('');
            }
        } else {
            setFormError('');
        }
    }, [password, isLogin]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        // Validación local (no depende del backend)
        if (!isLogin && password !== confirmPassword) {
            setFormError('Las contraseñas no coinciden');
            return;
        }

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, name);
            }
        } catch (err) {
            // Los errores de red/auth ya están en `error` del store
            console.error('Auth error:', err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.gridBackground} />

            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>ViarteIA</h1>
                    <p className={styles.subtitle}>
                        {isLogin
                            ? '¡Bienvenido de nuevo! Inicia sesión para continuar.'
                            : 'Crea tu cuenta para empezar a generar videos con IA.'}
                    </p>
                </div>

                {(formError || error) && (
                    <div className={styles.error}>
                        {formError || error}
                    </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="name">
                                Nombre completo
                            </label>
                            <input
                                id="name"
                                className={styles.input}
                                type="text"
                                placeholder="Juan Pérez"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="email">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            className={styles.input}
                            type="email"
                            placeholder="tu@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
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
                            <label className={styles.label} htmlFor="confirmPassword">
                                Confirmar contraseña
                            </label>
                            <input
                                id="confirmPassword"
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
                        {isLoading
                            ? 'Procesando...'
                            : isLogin
                                ? 'Iniciar sesión'
                                : 'Crear cuenta'}
                    </button>
                </form>

                <div className={styles.footer}>
                    {isLogin ? (
                        <p>
                            ¿No tienes cuenta?{' '}
                            <button
                                type="button"
                                className={styles.linkButton}
                                onClick={() => setIsLogin(false)}
                            >
                                Regístrate
                            </button>
                        </p>
                    ) : (
                        <p>
                            ¿Ya tienes cuenta?{' '}
                            <button
                                type="button"
                                className={styles.linkButton}
                                onClick={() => setIsLogin(true)}
                            >
                                Inicia sesión
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}