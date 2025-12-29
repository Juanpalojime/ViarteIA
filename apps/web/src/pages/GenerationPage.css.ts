import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const container = style({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});

export const studioHeader = style({
    padding: `${vars.space.lg} ${vars.space.xl}`,
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.md,
    borderBottom: `1px solid ${vars.color.border.default}`,
    backgroundColor: vars.color.background.panel,

    '@media': {
        '(min-width: 768px)': {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
    },
});

export const headerInfo = style({});

export const headerTitle = style({
    fontSize: vars.fontSize['2xl'],
    fontWeight: vars.fontWeight.bold,
    color: vars.color.text.primary,
    marginBottom: '4px',
});

export const headerSubtitle = style({
    fontSize: vars.fontSize.sm,
    color: vars.color.text.muted,
});

export const modeToggle = style({
    backgroundColor: vars.color.background.elevated,
    padding: '4px',
    borderRadius: vars.radius.lg,
    display: 'inline-flex',
    alignItems: 'center',
    height: '40px',
    width: '100%',
    minWidth: '300px',

    '@media': {
        '(min-width: 768px)': {
            width: 'auto',
        },
    },
});

export const modeButton = style({
    flex: 1,
    padding: `0 ${vars.space.lg}`,
    height: '100%',
    borderRadius: vars.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space.sm,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.medium,
    color: vars.color.text.muted,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,

    ':hover': {
        color: vars.color.text.primary,
    },
});

export const modeButtonActive = style([
    modeButton,
    {
        backgroundColor: vars.color.background.panel,
        color: vars.color.text.primary,
        boxShadow: vars.shadow.sm,
    },
]);

export const mainContent = style({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',

    '@media': {
        '(min-width: 1024px)': {
            flexDirection: 'row',
        },
    },
});

export const controlsPanel = style({
    width: '100%',
    backgroundColor: vars.color.background.panel,
    borderRight: `1px solid ${vars.color.border.default}`,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',

    '@media': {
        '(min-width: 1024px)': {
            width: '420px',
        },
    },
});

export const controlsContent = style({
    padding: vars.space.xl,
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.xl,
});

export const formGroup = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.sm,
});

export const label = style({
    fontSize: vars.fontSize.xs,
    fontWeight: vars.fontWeight.semibold,
    color: vars.color.text.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

export const textarea = style({
    width: '100%',
    minHeight: '128px',
    padding: vars.space.md,
    backgroundColor: vars.color.background.input,
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.lg,
    fontSize: vars.fontSize.sm,
    color: vars.color.text.primary,
    resize: 'vertical',
    transition: `all ${vars.transition.base}`,

    ':focus': {
        outline: 'none',
        borderColor: vars.color.primary.main,
        boxShadow: `0 0 0 2px ${vars.color.primary.alpha}`,
    },

    '::placeholder': {
        color: vars.color.text.subtle,
    },
});

export const input = style({
    width: '100%',
    height: '40px',
    padding: `0 ${vars.space.md}`,
    backgroundColor: vars.color.background.input,
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.lg,
    fontSize: vars.fontSize.sm,
    color: vars.color.text.primary,
    transition: `all ${vars.transition.base}`,

    ':focus': {
        outline: 'none',
        borderColor: vars.color.primary.main,
        boxShadow: `0 0 0 1px ${vars.color.primary.main}`,
    },

    '::placeholder': {
        color: vars.color.text.subtle,
    },
});

export const divider = style({
    height: '1px',
    backgroundColor: vars.color.border.default,
});

export const sectionTitle = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.bold,
    color: vars.color.text.primary,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

export const aspectRatioGrid = style({
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: vars.space.sm,
});

export const aspectRatioButton = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: vars.space.sm,
    gap: '4px',
    backgroundColor: vars.color.background.input,
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.md,
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,
    color: vars.color.text.muted,

    ':hover': {
        backgroundColor: vars.color.background.hover,
        color: vars.color.text.primary,
    },
});

export const aspectRatioButtonActive = style([
    aspectRatioButton,
    {
        backgroundColor: vars.color.background.elevated,
        borderColor: vars.color.primary.main,
        color: vars.color.text.primary,
    },
]);

export const sliderGroup = style({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: vars.space.lg,
});

export const sliderContainer = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.sm,
});

export const sliderLabel = style({
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: vars.fontSize.xs,
});

export const sliderLabelText = style({
    color: vars.color.text.muted,
});

export const sliderValue = style({
    color: vars.color.text.primary,
    fontWeight: vars.fontWeight.medium,
});

export const slider = style({
    width: '100%',
    height: '4px',
    backgroundColor: vars.color.background.elevated,
    borderRadius: vars.radius.full,
    appearance: 'none',
    cursor: 'pointer',

    '::-webkit-slider-thumb': {
        appearance: 'none',
        width: '16px',
        height: '16px',
        backgroundColor: vars.color.primary.main,
        borderRadius: vars.radius.full,
        border: `2px solid ${vars.color.background.panel}`,
        boxShadow: `0 0 0 1px ${vars.color.primary.main}`,
        cursor: 'pointer',
    },

    '::-moz-range-thumb': {
        width: '16px',
        height: '16px',
        backgroundColor: vars.color.primary.main,
        borderRadius: vars.radius.full,
        border: `2px solid ${vars.color.background.panel}`,
        boxShadow: `0 0 0 1px ${vars.color.primary.main}`,
        cursor: 'pointer',
    },
});

export const generateButton = style({
    width: '100%',
    height: '48px',
    backgroundColor: vars.color.primary.main,
    color: vars.color.text.inverse,
    border: 'none',
    borderRadius: vars.radius.lg,
    fontSize: vars.fontSize.base,
    fontWeight: vars.fontWeight.bold,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space.sm,
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,
    boxShadow: '0 0 20px rgba(85, 85, 246, 0.3)',

    ':hover': {
        backgroundColor: vars.color.primary.light,
        transform: 'scale(1.01)',
    },

    ':active': {
        transform: 'scale(0.99)',
    },
});

export const previewPanel = style({
    flex: 1,
    backgroundColor: vars.color.background.main,
    display: 'flex',
    flexDirection: 'column',
    padding: vars.space.xl,
    gap: vars.space.xl,
    overflowY: 'auto',
    minHeight: '500px',
});

export const previewPlayer = style({
    width: '100%',
    flex: 1,
    minHeight: '400px',
    backgroundColor: '#000',
    borderRadius: vars.radius.xl,
    border: `1px solid ${vars.color.border.default}`,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: vars.shadow.xl,
});

export const previewPlaceholder = style({
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: vars.space.lg,
    textAlign: 'center',
    padding: vars.space['2xl'],
});

export const playIcon = style({
    width: '64px',
    height: '64px',
    borderRadius: vars.radius.full,
    backgroundColor: vars.color.background.input,
    border: `1px solid ${vars.color.border.default}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: vars.color.text.subtle,
    marginBottom: vars.space.sm,
    transition: `all ${vars.transition.base}`,

    ':hover': {
        transform: 'scale(1.1)',
        color: vars.color.primary.main,
    },
});

export const historySection = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.md,
    height: '192px',
    flexShrink: 0,
});

export const historyHeader = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});

export const historyTitle = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.bold,
    color: vars.color.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.sm,
});

export const historyGrid = style({
    display: 'flex',
    gap: vars.space.lg,
    overflowX: 'auto',
    paddingBottom: vars.space.sm,
});

export const historyCard = style({
    width: '160px',
    aspectRatio: '16 / 9',
    backgroundColor: vars.color.background.input,
    borderRadius: vars.radius.lg,
    border: `1px solid ${vars.color.border.default}`,
    flexShrink: 0,
    position: 'relative',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: `all ${vars.transition.base}`,

    ':hover': {
        borderColor: vars.color.text.muted,
    },
});

export const historyCardGenerating = style([
    historyCard,
    {
        borderStyle: 'dashed',
        borderColor: vars.color.primary.main,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: vars.space.sm,
    },
]);

export const styleGrid = style({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: vars.space.sm,
    marginTop: vars.space.sm,
});

export const styleCard = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: vars.space.sm,
    backgroundColor: vars.color.background.input,
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.md,
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,
    textAlign: 'center',

    ':hover': {
        backgroundColor: vars.color.background.hover,
        borderColor: vars.color.primary.main,
    },
});

export const styleCardActive = style([
    styleCard,
    {
        borderColor: vars.color.primary.main,
        backgroundColor: vars.color.primary.alpha,
        color: vars.color.primary.main,
    },
]);

export const styleIcon = style({
    fontSize: '24px',
    marginBottom: '4px',
});

export const styleName = style({
    fontSize: '10px',
    fontWeight: vars.fontWeight.semibold,
    textTransform: 'uppercase',
});

export const magicButton = style({
    backgroundColor: 'transparent',
    border: 'none',
    color: vars.color.primary.main,
    fontSize: '11px',
    fontWeight: vars.fontWeight.bold,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: vars.radius.sm,
    transition: `all ${vars.transition.base}`,

    ':hover': {
        backgroundColor: vars.color.primary.alpha,
    },
});
