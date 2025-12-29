import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const container = style({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #16162a 50%, #0a0a0f 100%)',
    position: 'relative',
    overflow: 'hidden',
});

// Grid background effect
export const gridBackground = style({
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(#282839 1px, transparent 1px)',
    backgroundSize: '30px 30px',
    opacity: 0.15,
});

export const card = style({
    width: '100%',
    maxWidth: '420px',
    padding: vars.space.xl,
    borderRadius: '24px',
    backgroundColor: 'rgba(23, 23, 35, 0.6)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${vars.color.border.default}`,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.lg,
});

export const header = style({
    textAlign: 'center',
    marginBottom: vars.space.md,
});

export const title = style({
    fontSize: '32px',
    fontWeight: 700,
    background: vars.color.primary.gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: vars.space.xs,
});

export const subtitle = style({
    color: vars.color.text.secondary,
    fontSize: vars.font.size.sm,
});

export const form = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.md,
});

export const inputGroup = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.xs,
});

export const label = style({
    fontSize: vars.font.size.xs,
    color: vars.color.text.secondary,
    fontWeight: 500,
});

export const input = style({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: `1px solid ${vars.color.border.default}`,
    color: vars.color.text.primary,
    fontSize: vars.font.size.sm,
    transition: 'all 0.2s',
    outline: 'none',
    ':focus': {
        borderColor: vars.color.primary.main,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        boxShadow: `0 0 0 4px ${vars.color.primary.light}20`,
    },
});

export const button = style({
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: vars.color.primary.main,
    color: 'white',
    fontSize: vars.font.size.sm,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: vars.space.sm,
    ':hover': {
        background: vars.color.primary.hover,
        transform: 'translateY(-1px)',
    },
    ':active': {
        transform: 'translateY(0)',
    },
    ':disabled': {
        opacity: 0.7,
        cursor: 'not-allowed',
    },
});

export const footer = style({
    textAlign: 'center',
    fontSize: vars.font.size.sm,
    color: vars.color.text.secondary,
});

// ✅ ¡NUEVO! Estilo para botón de enlace accesible
export const linkButton = style({
    background: 'none',
    border: 'none',
    color: vars.color.primary.main,
    textDecoration: 'none',
    fontWeight: 500,
    cursor: 'pointer',
    font: 'inherit',
    padding: 0,
    textAlign: 'inherit',
    ':hover': {
        textDecoration: 'underline',
    },
});

export const error = style({
    color: '#ff4444',
    fontSize: vars.font.size.xs,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: '8px',
    borderRadius: '8px',
});