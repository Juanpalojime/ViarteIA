import { useState } from 'react';
import Layout from '../components/Layout';
import * as styles from './SettingsPage.css';

const SETTINGS_TABS = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'api-keys', label: 'API Keys', icon: '🔑' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'subscription', label: 'Subscription', icon: '💎' },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <Layout title="Settings" subtitle="Manage your account and preferences">
            <div className={styles.container}>
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    {SETTINGS_TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={activeTab === tab.id ? styles.tabButtonActive : styles.tabButton}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className={styles.tabIcon}>{tab.icon}</span>
                            <span className={styles.tabLabel}>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {activeTab === 'profile' && <ProfileTab />}
                    {activeTab === 'preferences' && <PreferencesTab />}
                    {activeTab === 'api-keys' && <APIKeysTab />}
                    {activeTab === 'notifications' && <NotificationsTab />}
                    {activeTab === 'security' && <SecurityTab />}
                    {activeTab === 'subscription' && <SubscriptionTab />}
                </div>
            </div>
        </Layout>
    );
}

function ProfileTab() {
    return (
        <div className={styles.tabContent}>
            <h2 className={styles.tabTitle}>Profile Settings</h2>
            <p className={styles.tabDescription}>Update your personal information</p>

            <div className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input type="text" className={styles.input} placeholder="John Doe" />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input type="email" className={styles.input} placeholder="john@example.com" />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Bio</label>
                    <textarea className={styles.textarea} placeholder="Tell us about yourself..." rows={4} />
                </div>

                <button className={styles.saveButton}>Save Changes</button>
            </div>
        </div>
    );
}

function PreferencesTab() {
    return (
        <div className={styles.tabContent}>
            <h2 className={styles.tabTitle}>Preferences</h2>
            <p className={styles.tabDescription}>Customize your experience</p>

            <div className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Language</label>
                    <select className={styles.select}>
                        <option>English</option>
                        <option>Español</option>
                        <option>Français</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Theme</label>
                    <select className={styles.select}>
                        <option>Dark</option>
                        <option>Light</option>
                        <option>Auto</option>
                    </select>
                </div>

                <button className={styles.saveButton}>Save Preferences</button>
            </div>
        </div>
    );
}

function APIKeysTab() {
    return (
        <div className={styles.tabContent}>
            <h2 className={styles.tabTitle}>API Keys</h2>
            <p className={styles.tabDescription}>Manage your API keys for integrations</p>

            <div className={styles.apiKeyCard}>
                <div className={styles.apiKeyHeader}>
                    <span className={styles.apiKeyName}>Production Key</span>
                    <button className={styles.copyButton}>📋 Copy</button>
                </div>
                <code className={styles.apiKeyValue}>vta_prod_••••••••••••••••••••1234</code>
            </div>

            <button className={styles.createButton}>+ Create New Key</button>
        </div>
    );
}

function NotificationsTab() {
    return (
        <div className={styles.tabContent}>
            <h2 className={styles.tabTitle}>Notifications</h2>
            <p className={styles.tabDescription}>Configure how you receive notifications</p>

            <div className={styles.form}>
                <div className={styles.toggleGroup}>
                    <div className={styles.toggleLabel}>
                        <span>Email Notifications</span>
                        <p className={styles.toggleDescription}>Receive updates via email</p>
                    </div>
                    <input type="checkbox" className={styles.toggle} defaultChecked />
                </div>

                <div className={styles.toggleGroup}>
                    <div className={styles.toggleLabel}>
                        <span>Generation Complete</span>
                        <p className={styles.toggleDescription}>Notify when video generation is complete</p>
                    </div>
                    <input type="checkbox" className={styles.toggle} defaultChecked />
                </div>

                <div className={styles.toggleGroup}>
                    <div className={styles.toggleLabel}>
                        <span>Weekly Summary</span>
                        <p className={styles.toggleDescription}>Receive weekly activity summary</p>
                    </div>
                    <input type="checkbox" className={styles.toggle} />
                </div>
            </div>
        </div>
    );
}

function SecurityTab() {
    return (
        <div className={styles.tabContent}>
            <h2 className={styles.tabTitle}>Security</h2>
            <p className={styles.tabDescription}>Manage your account security</p>

            <div className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Current Password</label>
                    <input type="password" className={styles.input} placeholder="••••••••" />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>New Password</label>
                    <input type="password" className={styles.input} placeholder="••••••••" />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Confirm Password</label>
                    <input type="password" className={styles.input} placeholder="••••••••" />
                </div>

                <button className={styles.saveButton}>Update Password</button>
            </div>
        </div>
    );
}

function SubscriptionTab() {
    return (
        <div className={styles.tabContent}>
            <h2 className={styles.tabTitle}>Subscription</h2>
            <p className={styles.tabDescription}>Manage your subscription plan</p>

            <div className={styles.planCard}>
                <div className={styles.planHeader}>
                    <span className={styles.planBadge}>Current Plan</span>
                    <h3 className={styles.planName}>Free Plan</h3>
                </div>
                <p className={styles.planDescription}>15 credits per month</p>
                <button className={styles.upgradeButton}>✨ Upgrade to Pro</button>
            </div>
        </div>
    );
}
