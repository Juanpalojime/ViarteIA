import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

// Reset básico
globalStyle('*, *::before, *::after', {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
});

globalStyle('html, body', {
    height: '100%',
    fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: vars.fontSize.base,
    fontWeight: vars.fontWeight.normal,
    lineHeight: 1.5,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
});

globalStyle('body', {
    backgroundColor: vars.color.background.main,
    color: vars.color.text.primary,
});

globalStyle('#root', {
    height: '100%',
});

// Scrollbar personalizado
globalStyle('::-webkit-scrollbar', {
    width: '8px',
    height: '8px',
});

globalStyle('::-webkit-scrollbar-track', {
    background: vars.color.background.main,
});

globalStyle('::-webkit-scrollbar-thumb', {
    background: vars.color.border.default,
    borderRadius: vars.radius.sm,
});

globalStyle('::-webkit-scrollbar-thumb:hover', {
    background: vars.color.border.hover,
});

// Selection
globalStyle('::selection', {
    backgroundColor: vars.color.primary.alpha,
    color: vars.color.text.primary,
});

// Focus visible
globalStyle(':focus-visible', {
    outline: `2px solid ${vars.color.primary.main}`,
    outlineOffset: '2px',
});

// Imágenes
globalStyle('img, picture, video, canvas, svg', {
    display: 'block',
    maxWidth: '100%',
});

// Botones y inputs
globalStyle('button, input, textarea, select', {
    font: 'inherit',
});

// Links
globalStyle('a', {
    color: 'inherit',
    textDecoration: 'none',
});
