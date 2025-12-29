import { createTheme, createThemeContract } from '@vanilla-extract/css';

// Define el contrato de tema (variables CSS)
export const vars = createThemeContract({
    color: {
        primary: {
            main: null,
            light: null,
            dark: null,
            alpha: null,
        },
        background: {
            main: null,
            panel: null,
            elevated: null,
            input: null,
            hover: null,
        },
        border: {
            default: null,
            hover: null,
            focus: null,
        },
        text: {
            primary: null,
            secondary: null,
            muted: null,
            subtle: null,
            inverse: null,
        },
        status: {
            success: null,
            warning: null,
            error: null,
            info: null,
        },
    },
    space: {
        xs: null,
        sm: null,
        md: null,
        lg: null,
        xl: null,
        '2xl': null,
        '3xl': null,
    },
    fontSize: {
        xs: null,
        sm: null,
        base: null,
        lg: null,
        xl: null,
        '2xl': null,
        '3xl': null,
        '4xl': null,
    },
    fontWeight: {
        normal: null,
        medium: null,
        semibold: null,
        bold: null,
    },
    radius: {
        sm: null,
        md: null,
        lg: null,
        xl: null,
        full: null,
    },
    shadow: {
        sm: null,
        md: null,
        lg: null,
        xl: null,
    },
    transition: {
        fast: null,
        base: null,
        slow: null,
    },
});

// Tema oscuro (principal)
export const darkTheme = createTheme(vars, {
    color: {
        primary: {
            main: '#5555f6',
            light: '#7676f8',
            dark: '#3434d4',
            alpha: 'rgba(85, 85, 246, 0.1)',
        },
        background: {
            main: '#0F0F12',
            panel: '#111118',
            elevated: '#1c1c26',
            input: '#1c1c26',
            hover: '#282839',
        },
        border: {
            default: '#282839',
            hover: '#3f3f50',
            focus: '#5555f6',
        },
        text: {
            primary: '#ffffff',
            secondary: '#e0e0e8',
            muted: '#9c9cba',
            subtle: '#555566',
            inverse: '#0F0F12',
        },
        status: {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
    },
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
    },
    fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
    },
    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    radius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
    },
    shadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    transition: {
        fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
});

// Tema claro (opcional)
export const lightTheme = createTheme(vars, {
    color: {
        primary: {
            main: '#5555f6',
            light: '#7676f8',
            dark: '#3434d4',
            alpha: 'rgba(85, 85, 246, 0.1)',
        },
        background: {
            main: '#ffffff',
            panel: '#f5f5f8',
            elevated: '#ffffff',
            input: '#f5f5f8',
            hover: '#e8e8ec',
        },
        border: {
            default: '#e0e0e8',
            hover: '#c0c0cc',
            focus: '#5555f6',
        },
        text: {
            primary: '#0F0F12',
            secondary: '#1c1c26',
            muted: '#555566',
            subtle: '#9c9cba',
            inverse: '#ffffff',
        },
        status: {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
    },
    space: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
    },
    fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
    },
    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    radius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
    },
    shadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    transition: {
        fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
});
