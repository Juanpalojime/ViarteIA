import { useAtom } from 'jotai';
import { sidebarOpenAtom } from '../atoms/ui';
import { useAuthStore } from '../stores/auth';
import * as styles from './Header.css';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    const [, setIsOpen] = useAtom(sidebarOpenAtom);
    const { user } = useAuthStore();

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                {/* Mobile menu button */}
                <button
                    className={styles.iconButton}
                    onClick={() => setIsOpen((prev) => !prev)}
                    style={{ display: 'none' }}
                    aria-label="Toggle menu"
                >
                    ☰
                </button>

                <div>
                    <h1 className={styles.headerTitle}>{title}</h1>
                    {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
                </div>
            </div>

            <div className={styles.headerRight}>
                {/* Search */}
                <button className={styles.searchButton} aria-label="Search">
                    <span>🔍</span>
                    <span className={styles.searchText}>Search...</span>
                    <span className={styles.searchShortcut}>⌘K</span>
                </button>

                {/* Notifications */}
                <button className={styles.iconButton} aria-label="Notifications">
                    <span>🔔</span>
                    <span className={styles.badge} />
                </button>

                {/* Help */}
                <button className={styles.iconButton} aria-label="Help">
                    <span>❓</span>
                </button>

                {/* Upgrade button (only for free users) */}
                {user?.plan === 'free' && (
                    <button className={styles.upgradeButton}>
                        <span>✨</span>
                        <span>Upgrade</span>
                    </button>
                )}
            </div>
        </header>
    );
}
