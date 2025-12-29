import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const container = style({
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
});

export const sidebar = style({
    width: '240px',
    borderRight: `1px solid ${vars.color.border.default}`,
    padding: vars.space.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.sm,
    backgroundColor: vars.color.background.panel,
    overflowY: 'auto',
});

export const tabButton = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.md,
    padding: vars.space.md,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: vars.radius.md,
    color: vars.color.text.muted,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.medium,
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,
    textAlign: 'left',

    ':hover': {
        backgroundColor: vars.color.background.hover,
        color: vars.color.text.primary,
    },
});

export const tabButtonActive = style([
    tabButton,
    {
        backgroundColor: vars.color.primary.alpha,
        color: vars.color.primary.main,

        ':hover': {
            backgroundColor: vars.color.primary.alpha,
            color: vars.color.primary.main,
        },
    },
]);

export const tabIcon = style({
    fontSize: '20px',
});

export const tabLabel = style({});

export const content = style({
    flex: 1,
    overflowY: 'auto',
    padding: vars.space['2xl'],
});

export const tabContent = style({
    maxWidth: '600px',
});

export const tabTitle = style({
    fontSize: vars.fontSize['2xl'],
    fontWeight: vars.fontWeight.bold,
    color: vars.color.text.primary,
    marginBottom: vars.space.sm,
});

export const tabDescription = style({
    fontSize: vars.fontSize.sm,
    color: vars.color.text.muted,
    marginBottom: vars.space.xl,
});

export const form = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.lg,
});

export const formGroup = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.sm,
});

export const label = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.medium,
    color: vars.color.text.primary,
});

export const input = style({
    width: '100%',
    height: '40px',
    padding: `0 ${vars.space.md}`,
    backgroundColor: vars.color.background.input,
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.sm,
    color: vars.color.text.primary,
    transition: `all ${vars.transition.base}`,

    ':focus': {
        outline: 'none',
        borderColor: vars.color.primary.main,
    },
});

export const textarea = style({
    width: '100%',
    padding: vars.space.md,
    backgroundColor: vars.color.background.input,
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.sm,
    color: vars.color.text.primary,
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: `all ${vars.transition.base}`,

    ':focus': {
        outline: 'none',
        borderColor: vars.color.primary.main,
    },
});

export const select = style({
    width: '100%',
    height: '40px',
    padding: `0 ${vars.space.md}`,
    backgroundColor: vars.color.background.input,
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.sm,
    color: vars.color.text.primary,
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,

    ':focus': {
        outline: 'none',
        borderColor: vars.color.primary.main,
    },
});

export const saveButton = style({
    padding: `${vars.space.md} ${vars.space.xl}`,
    backgroundColor: vars.color.primary.main,
    color: vars.color.text.inverse,
    border: 'none',
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.semibold,
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,
    alignSelf: 'flex-start',

    ':hover': {
        backgroundColor: vars.color.primary.light,
    },
});

export const toggleGroup = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: vars.space.md,
    backgroundColor: vars.color.background.input,
    borderRadius: vars.radius.md,
});

export const toggleLabel = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
});

export const toggleDescription = style({
    fontSize: vars.fontSize.xs,
    color: vars.color.text.muted,
});

export const toggle = style({
    width: '44px',
    height: '24px',
    appearance: 'none',
    backgroundColor: vars.color.background.elevated,
    borderRadius: vars.radius.full,
    position: 'relative',
    cursor: 'pointer',
    transition: `background-color ${vars.transition.base}`,

    '::before': {
        content: '""',
        position: 'absolute',
        width: '20px',
        height: '20px',
        backgroundColor: vars.color.text.inverse,
        borderRadius: vars.radius.full,
        top: '2px',
        left: '2px',
        transition: `transform ${vars.transition.base}`,
    },

    ':checked': {
        backgroundColor: vars.color.primary.main,
    },

    ':checked::before': {
        transform: 'translateX(20px)',
    },
});

export const apiKeyCard = style({
    padding: vars.space.lg,
    backgroundColor: vars.color.background.input,
    borderRadius: vars.radius.lg,
    marginBottom: vars.space.lg,
});

export const apiKeyHeader = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vars.space.md,
});

export const apiKeyName = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.semibold,
    color: vars.color.text.primary,
});

export const copyButton = style({
    padding: `${vars.space.sm} ${vars.space.md}`,
    backgroundColor: vars.color.background.elevated,
    border: 'none',
    borderRadius: vars.radius.sm,
    fontSize: vars.fontSize.xs,
    color: vars.color.text.muted,
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,

    ':hover': {
        color: vars.color.text.primary,
    },
});

export const apiKeyValue = style({
    display: 'block',
    padding: vars.space.md,
    backgroundColor: vars.color.background.main,
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.sm,
    fontFamily: 'monospace',
    color: vars.color.text.muted,
});

export const createButton = style({
    padding: `${vars.space.md} ${vars.space.xl}`,
    backgroundColor: vars.color.background.elevated,
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.medium,
    color: vars.color.text.primary,
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,

    ':hover': {
        backgroundColor: vars.color.background.hover,
    },
});

export const planCard = style({
    padding: vars.space.xl,
    backgroundColor: vars.color.background.input,
    borderRadius: vars.radius.xl,
    border: `1px solid ${vars.color.border.default}`,
});

export const planHeader = style({
    marginBottom: vars.space.md,
});

export const planBadge = style({
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: vars.color.primary.alpha,
    color: vars.color.primary.main,
    fontSize: vars.fontSize.xs,
    fontWeight: vars.fontWeight.semibold,
    borderRadius: vars.radius.sm,
    marginBottom: vars.space.sm,
});

export const planName = style({
    fontSize: vars.fontSize.xl,
    fontWeight: vars.fontWeight.bold,
    color: vars.color.text.primary,
});

export const planDescription = style({
    fontSize: vars.fontSize.sm,
    color: vars.color.text.muted,
    marginBottom: vars.space.lg,
});

export const upgradeButton = style({
    width: '100%',
    padding: `${vars.space.md} ${vars.space.xl}`,
    backgroundColor: vars.color.primary.main,
    color: vars.color.text.inverse,
    border: 'none',
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.semibold,
    cursor: 'pointer',
    transition: `all ${vars.transition.base}`,

    ':hover': {
        backgroundColor: vars.color.primary.light,
    },
});
