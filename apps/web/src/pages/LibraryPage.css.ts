import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const container = style({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});

export const filtersBar = style({
    padding: vars.space.lg,
    borderBottom: `1px solid ${vars.color.border.default}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: vars.space.lg,
    backgroundColor: vars.color.background.panel,
});

export const filterButtons = style({
    display: 'flex',
    gap: vars.space.sm,
});

export const filterButton = style({
    padding: `${vars.space.sm} ${vars.space.lg}`,
    backgroundColor: 'transparent',
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.md,
    color: vars.color.text.muted,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.medium,
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,

    ':hover': {
        backgroundColor: vars.color.background.hover,
        color: vars.color.text.primary,
    },
});

export const filterButtonActive = style([
    filterButton,
    {
        backgroundColor: vars.color.primary.main,
        borderColor: vars.color.primary.main,
        color: vars.color.text.inverse,

        ':hover': {
            backgroundColor: vars.color.primary.light,
            color: vars.color.text.inverse,
        },
    },
]);

export const viewToggle = style({
    display: 'flex',
    gap: '4px',
    backgroundColor: vars.color.background.elevated,
    padding: '4px',
    borderRadius: vars.radius.md,
});

export const viewButton = style({
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: vars.radius.sm,
    color: vars.color.text.muted,
    fontSize: '16px',
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,

    ':hover': {
        color: vars.color.text.primary,
    },
});

export const viewButtonActive = style([
    viewButton,
    {
        backgroundColor: vars.color.background.panel,
        color: vars.color.text.primary,
    },
]);

export const content = style({
    flex: 1,
    overflowY: 'auto',
    padding: vars.space.xl,
});

export const section = style({
    marginBottom: vars.space['2xl'],
});

export const sectionHeader = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vars.space.lg,
});

export const sectionTitle = style({
    fontSize: vars.fontSize.base,
    fontWeight: vars.fontWeight.semibold,
    color: vars.color.text.primary,
});

export const sectionCount = style({
    fontSize: vars.fontSize.xs,
    color: vars.color.text.subtle,
});

export const grid = style({
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: vars.space.lg,

    '@media': {
        '(min-width: 640px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
        },
        '(min-width: 1024px)': {
            gridTemplateColumns: 'repeat(3, 1fr)',
        },
        '(min-width: 1536px)': {
            gridTemplateColumns: 'repeat(4, 1fr)',
        },
    },
});

export const card = style({
    backgroundColor: vars.color.background.input,
    borderRadius: vars.radius.xl,
    border: `1px solid ${vars.color.border.default}`,
    overflow: 'hidden',
    transition: `all ${vars.transition.base}`,

    ':hover': {
        borderColor: vars.color.primary.main,
    },
});

export const cardThumbnail = style({
    aspectRatio: '16 / 9',
    width: '100%',
    backgroundColor: vars.color.background.panel,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

export const cardImage = style({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.8,
    transition: `transform ${vars.transition.slow}`,

    ':hover': {
        transform: 'scale(1.05)',
    },
});

export const processingState = style({
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: vars.space.sm,

    '::before': {
        content: '""',
        position: 'absolute',
        inset: '-100px',
        background: 'linear-gradient(135deg, rgba(85,85,246,0.2) 0%, rgba(139,92,246,0.2) 100%)',
        zIndex: -1,
    },
});

export const spinner = style({
    width: '32px',
    height: '32px',
    border: `2px solid ${vars.color.primary.main}`,
    borderTopColor: 'transparent',
    borderRadius: vars.radius.full,
    animation: 'spin 1s linear infinite',
});

export const processingText = style({
    fontSize: vars.fontSize.xs,
    fontWeight: vars.fontWeight.medium,
    color: vars.color.text.primary,
    letterSpacing: '0.1em',
});

export const durationBadge = style({
    position: 'absolute',
    bottom: vars.space.sm,
    right: vars.space.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(8px)',
    color: vars.color.text.inverse,
    fontSize: vars.fontSize.xs,
    fontFamily: 'monospace',
    padding: '2px 6px',
    borderRadius: vars.radius.sm,
});

export const badges = style({
    position: 'absolute',
    top: vars.space.sm,
    left: vars.space.sm,
    display: 'flex',
    gap: vars.space.sm,
});

export const aiBadge = style({
    backgroundColor: vars.color.primary.main,
    color: vars.color.text.inverse,
    fontSize: '10px',
    fontWeight: vars.fontWeight.bold,
    padding: '2px 6px',
    borderRadius: vars.radius.sm,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backdropFilter: 'blur(4px)',
});

export const imageBadge = style({
    backgroundColor: '#a855f7',
    color: vars.color.text.inverse,
    fontSize: '10px',
    fontWeight: vars.fontWeight.bold,
    padding: '2px 6px',
    borderRadius: vars.radius.sm,
    backdropFilter: 'blur(4px)',
});

export const hoverActions = style({
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(2px)',
    opacity: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space.sm,
    transition: `opacity ${vars.transition.base}`,

    ':hover': {
        opacity: 1,
    },
});

export const actionButton = style({
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(8px)',
    border: 'none',
    borderRadius: vars.radius.full,
    color: vars.color.text.inverse,
    fontSize: '18px',
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,

    ':hover': {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
});

export const actionButtonDanger = style([
    actionButton,
    {
        ':hover': {
            backgroundColor: 'rgba(239,68,68,0.2)',
        },
    },
]);

export const cardInfo = style({
    padding: vars.space.md,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: vars.space.sm,
});

export const cardContent = style({
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
});

export const cardTitle = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.medium,
    color: vars.color.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    transition: `color ${vars.transition.base}`,

    ':hover': {
        color: vars.color.primary.main,
    },
});

export const cardMeta = style({
    fontSize: vars.fontSize.xs,
    color: vars.color.text.muted,
    marginTop: '2px',
});

export const progressContainer = style({
    width: '100%',
    marginTop: vars.space.sm,
});

export const progressBar = style({
    width: '100%',
    height: '4px',
    backgroundColor: vars.color.background.elevated,
    borderRadius: vars.radius.full,
    overflow: 'hidden',
});

export const progressFill = style({
    height: '100%',
    backgroundColor: vars.color.primary.main,
    borderRadius: vars.radius.full,
    transition: `width ${vars.transition.base}`,
});

export const progressInfo = style({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '4px',
});

export const progressLabel = style({
    fontSize: '10px',
    color: vars.color.text.muted,
});

export const progressValue = style({
    fontSize: '10px',
    color: vars.color.text.primary,
});

export const menuButton = style({
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: vars.radius.sm,
    color: vars.color.text.muted,
    fontSize: '18px',
    cursor: 'pointer',
    flexShrink: 0,
    transition: `color ${vars.transition.base}`,

    ':hover': {
        color: vars.color.text.primary,
    },
});

export const uploadZone = style({
    border: `2px dashed ${vars.color.border.default}`,
    borderRadius: vars.radius.xl,
    padding: vars.space['2xl'],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,

    ':hover': {
        borderColor: vars.color.primary.main,
        backgroundColor: 'rgba(26,26,32,0.5)',
    },
});

export const uploadIcon = style({
    width: '48px',
    height: '48px',
    borderRadius: vars.radius.full,
    backgroundColor: vars.color.background.elevated,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: vars.space.md,
    transition: `all ${vars.transition.base}`,

    ':hover': {
        backgroundColor: vars.color.primary.alpha,
    },
});

export const uploadTitle = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.medium,
    color: vars.color.text.primary,
});

export const uploadSubtitle = style({
    fontSize: vars.fontSize.xs,
    color: vars.color.text.muted,
    marginTop: '4px',
});
