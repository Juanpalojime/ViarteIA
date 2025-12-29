import { style } from '@vanilla-extract/css';
import { vars } from './styles/theme.css';

export const app = style({
    minHeight: '100vh',
    backgroundColor: vars.color.background.main,
    color: vars.color.text.primary,
    display: 'flex',
    flexDirection: 'column',
});
