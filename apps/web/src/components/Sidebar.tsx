import { Link, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { sidebarOpenAtom } from '../atoms/ui';
import { useAuthStore } from '../stores/auth';
import * as styles from './Layout.css';
import clsx from 'clsx';
import GPUIndicator from './GPUIndicator';

const navigation = [
    {
        section: 'Create',
        items: [
            { name: 'Generation', path: '/generation', icon: '🎬' },
            { name: 'Editor', path: '/editor', icon: '✂️' },
            { name: 'Templates', path: '/templates', icon: '📋' },
        ],
    },
    {
        section: 'Library',
        items: [
            { name: 'My Videos', path: '/library', icon: '🎞️' },
            { name: 'Favorites', path: '/favorites', icon: '⭐' },
            { name: 'Community', path: '/community', icon: '👥' },
        ],
    },
    {
        section: 'Account',
        items: [
            { name: 'Settings', path: '/settings', icon: '⚙️' },
            { name: 'Subscription', path: '/subscription', icon: '💎' },
        ],
    },
];

export default function Sidebar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useAtom(sidebarOpenAtom);
    const { user } = useAuthStore();

    const handleLinkClick = () => {
        // Close sidebar on mobile after clicking a link
        if (window.innerWidth <= 768) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={clsx(styles.overlay, isOpen && styles.overlayVisible)}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside className={clsx(styles.sidebar, isOpen && styles.sidebarOpen)}>
                {/* Logo */}
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>🎨</div>
                        <span>ViarteIA</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    {navigation.map((section) => (
                        <div key={section.section} className={styles.navSection}>
                            <div className={styles.navSectionTitle}>{section.section}</div>
                            {section.items.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={
                                        location.pathname === item.path
                                            ? styles.navLinkActive
                                            : styles.navLink
                                    }
                                    onClick={handleLinkClick}
                                >
                                    <span className={styles.navIcon}>{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* User card */}
                <div className={styles.sidebarFooter}>
                    <div style={{ marginBottom: '16px' }}>
                        <GPUIndicator />
                    </div>
                    <Link to="/profile" className={styles.userCard} onClick={handleLinkClick}>
                        <div className={styles.userAvatar}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>
                                {user?.name || 'Demo User'}
                            </div>
                            <div className={styles.userPlan}>
                                {user?.plan || 'Free'} Plan
                            </div>
                        </div>
                    </Link>
                </div>
            </aside>
        </>
    );
}
