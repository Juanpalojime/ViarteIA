import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import * as styles from './Layout.css';

interface LayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export default function Layout({ children, title, subtitle }: LayoutProps) {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.main}>
                <Header title={title} subtitle={subtitle} />
                {children}
            </main>
        </div>
    );
}
