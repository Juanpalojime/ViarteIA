import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const layout = style({
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: vars.color.background.main,
});

export const sidebar = style({
    width: '280px',
    backgroundColor: vars.color.background.panel,
    borderRight: `1px solid ${vars.color.border.default}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',

    '@media': {
        '(max-width: 768px)': {
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100,
            transform: 'translateX(-100%)',
            transition: `transform ${vars.transition.base}`,
        },
    },
});

export const sidebarOpen = style({
    '@media': {
        '(max-width: 768px)': {
            transform: 'translateX(0)',
        },
    },
});

export const sidebarHeader = style({
    padding: vars.space.xl,
    borderBottom: `1px solid ${vars.color.border.default}`,
});

export const logo = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.md,
    fontSize: vars.fontSize['2xl'],
    fontWeight: vars.fontWeight.bold,
    color: vars.color.text.primary,
});

export const logoIcon = style({
    width: '40px',
    height: '40px',
    background: `linear-gradient(135deg, ${vars.color.primary.main} 0%, ${vars.color.primary.light} 100%)`,
    borderRadius: vars.radius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: vars.fontSize.xl,
});

export const nav = style({
    flex: 1,
    padding: vars.space.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.sm,
    overflowY: 'auto',
});

export const navSection = style({
    marginBottom: vars.space.lg,
});

export const navSectionTitle = style({
    fontSize: vars.fontSize.xs,
    fontWeight: vars.fontWeight.semibold,
    color: vars.color.text.subtle,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: vars.space.sm,
    paddingLeft: vars.space.md,
});

export const navLink = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.md,
    padding: `${vars.space.md} ${vars.space.lg}`,
    borderRadius: vars.radius.md,
    color: vars.color.text.muted,
    fontSize: vars.fontSize.base,
    fontWeight: vars.fontWeight.medium,
    textDecoration: 'none',
    transition: `all ${vars.transition.base}`,
    cursor: 'pointer',

    ':hover': {
        backgroundColor: vars.color.background.hover,
        color: vars.color.text.primary,
    },
});

export const navLinkActive = style([
    navLink,
    {
        backgroundColor: vars.color.primary.alpha,
        color: vars.color.primary.main,

        ':hover': {
            backgroundColor: vars.color.primary.alpha,
            color: vars.color.primary.main,
        },
    },
]);

export const navIcon = style({
    fontSize: '20px',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

export const sidebarFooter = style({
    padding: vars.space.lg,
    borderTop: `1px solid ${vars.color.border.default}`,
});

export const userCard = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.md,
    padding: vars.space.md,
    borderRadius: vars.radius.lg,
    backgroundColor: vars.color.background.elevated,
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,

    ':hover': {
        backgroundColor: vars.color.background.hover,
    },
});

export const userAvatar = style({
    width: '40px',
    height: '40px',
    borderRadius: vars.radius.full,
    background: `linear-gradient(135deg, ${vars.color.primary.main} 0%, ${vars.color.primary.light} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: vars.fontSize.lg,
    fontWeight: vars.fontWeight.bold,
    color: vars.color.text.inverse,
});

export const userInfo = style({
    flex: 1,
    minWidth: 0,
});

export const userName = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.semibold,
    color: vars.color.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
});

export const userPlan = style({
    fontSize: vars.fontSize.xs,
    color: vars.color.text.subtle,
    textTransform: 'uppercase',
});

export const main = style({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
});

export const mobileMenuButton = style({
    display: 'none',

    '@media': {
        '(max-width: 768px)': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: vars.color.background.elevated,
            border: 'none',
            borderRadius: vars.radius.md,
            color: vars.color.text.primary,
            cursor: 'pointer',
            fontSize: '20px',
        },
    },
});

export const overlay = style({
    display: 'none',

    '@media': {
        '(max-width: 768px)': {
            display: 'block',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99,
            opacity: 0,
            pointerEvents: 'none',
            transition: `opacity ${vars.transition.base}`,
        },
    },
});

export const overlayVisible = style({
    opacity: 1,
    pointerEvents: 'auto',
});
