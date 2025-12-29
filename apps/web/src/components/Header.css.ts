import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const header = style({
    height: '72px',
    backgroundColor: vars.color.background.panel,
    borderBottom: `1px solid ${vars.color.border.default}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${vars.space.xl}`,
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(17, 17, 24, 0.8)',
});

export const headerLeft = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.lg,
});

export const headerTitle = style({
    fontSize: vars.fontSize['2xl'],
    fontWeight: vars.fontWeight.bold,
    color: vars.color.text.primary,

    '@media': {
        '(max-width: 768px)': {
            fontSize: vars.fontSize.xl,
        },
    },
});

export const headerSubtitle = style({
    fontSize: vars.fontSize.sm,
    color: vars.color.text.muted,
    marginTop: '2px',

    '@media': {
        '(max-width: 768px)': {
            display: 'none',
        },
    },
});

export const headerRight = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.md,
});

export const iconButton = style({
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: vars.color.background.elevated,
    border: 'none',
    borderRadius: vars.radius.md,
    color: vars.color.text.muted,
    cursor: 'pointer',
    fontSize: '20px',
    transition: `all ${vars.transition.base}`,
    position: 'relative',

    ':hover': {
        backgroundColor: vars.color.background.hover,
        color: vars.color.text.primary,
    },
});

export const badge = style({
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '8px',
    height: '8px',
    backgroundColor: vars.color.status.error,
    borderRadius: vars.radius.full,
    border: `2px solid ${vars.color.background.panel}`,
});

export const searchButton = style([
    iconButton,
    {
        width: 'auto',
        minWidth: '200px',
        justifyContent: 'flex-start',
        padding: `0 ${vars.space.md}`,
        gap: vars.space.sm,

        '@media': {
            '(max-width: 768px)': {
                minWidth: '40px',
                width: '40px',
                padding: 0,
                justifyContent: 'center',
            },
        },
    },
]);

export const searchText = style({
    fontSize: vars.fontSize.sm,
    color: vars.color.text.subtle,

    '@media': {
        '(max-width: 768px)': {
            display: 'none',
        },
    },
});

export const searchShortcut = style({
    marginLeft: 'auto',
    fontSize: vars.fontSize.xs,
    color: vars.color.text.subtle,
    backgroundColor: vars.color.background.main,
    padding: '2px 6px',
    borderRadius: vars.radius.sm,

    '@media': {
        '(max-width: 768px)': {
            display: 'none',
        },
    },
});

export const upgradeButton = style({
    padding: `${vars.space.sm} ${vars.space.lg}`,
    backgroundColor: vars.color.primary.main,
    color: vars.color.text.inverse,
    border: 'none',
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.semibold,
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.sm,

    ':hover': {
        backgroundColor: vars.color.primary.light,
        transform: 'translateY(-1px)',
    },

    '@media': {
        '(max-width: 768px)': {
            padding: `${vars.space.sm} ${vars.space.md}`,
            fontSize: vars.fontSize.xs,
        },
    },
});
