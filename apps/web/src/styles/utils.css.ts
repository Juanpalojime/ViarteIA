import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

// Layout utilities
export const flex = style({
    display: 'flex',
});

export const flexCol = style({
    display: 'flex',
    flexDirection: 'column',
});

export const flexCenter = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

export const grid = style({
    display: 'grid',
});

// Spacing utilities
export const gap = {
    xs: style({ gap: vars.space.xs }),
    sm: style({ gap: vars.space.sm }),
    md: style({ gap: vars.space.md }),
    lg: style({ gap: vars.space.lg }),
    xl: style({ gap: vars.space.xl }),
};

// Text utilities
export const textTruncate = style({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
});

export const textCenter = style({
    textAlign: 'center',
});

// Glassmorphism effect
export const glass = style({
    background: 'rgba(28, 28, 38, 0.6)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${vars.color.border.default}`,
});

// Gradient backgrounds
export const gradientPrimary = style({
    background: `linear-gradient(135deg, ${vars.color.primary.main} 0%, ${vars.color.primary.dark} 100%)`,
});

export const gradientSubtle = style({
    background: `linear-gradient(180deg, ${vars.color.background.elevated} 0%, ${vars.color.background.main} 100%)`,
});

// Animations
export const fadeIn = style({
    animation: 'fadeIn 0.3s ease-in-out',
    '@keyframes': {
        fadeIn: {
            from: { opacity: 0 },
            to: { opacity: 1 },
        },
    },
});

export const slideUp = style({
    animation: 'slideUp 0.3s ease-out',
    '@keyframes': {
        slideUp: {
            from: { transform: 'translateY(10px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 },
        },
    },
});

// Interactive states
export const interactive = style({
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,
    ':hover': {
        transform: 'translateY(-1px)',
    },
    ':active': {
        transform: 'translateY(0)',
    },
});

// Responsive utilities
export const hideOnMobile = style({
    '@media': {
        '(max-width: 768px)': {
            display: 'none',
        },
    },
});

export const hideOnDesktop = style({
    '@media': {
        '(min-width: 769px)': {
            display: 'none',
        },
    },
});
