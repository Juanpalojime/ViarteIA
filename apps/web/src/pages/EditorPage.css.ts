import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

export const editorLayout = style({
    display: 'grid',
    gridTemplateRows: '60px 1fr 300px', // Header, Main, Timeline
    height: '100vh',
    backgroundColor: '#0f0f15',
    color: vars.color.text.primary,
});

export const header = style({
    borderBottom: `1px solid ${vars.color.border.default}`,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    justifyContent: 'space-between',
    backgroundColor: '#16162a',
});

export const mainSection = style({
    display: 'grid',
    gridTemplateColumns: '300px 1fr 250px', // Browser, Preview, Properties
    borderBottom: `1px solid ${vars.color.border.default}`,
    overflow: 'hidden',
});

export const panel = style({
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${vars.color.border.default}`,
    height: '100%',
    overflow: 'hidden',
});

export const panelHeader = style({
    padding: '12px',
    borderBottom: `1px solid ${vars.color.border.default}`,
    fontSize: vars.font.size.sm,
    fontWeight: 600,
    backgroundColor: '#1a1a2e',
    color: vars.color.text.secondary,
});

export const assetGrid = style({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    padding: '8px',
    overflowY: 'auto',
});

export const assetCard = style({
    cursor: 'move',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '1px solid transparent',
    transition: 'all 0.2s',
    ':hover': {
        borderColor: vars.color.primary.main,
    },
});

export const assetThumbnail = style({
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: '#282839',
    objectFit: 'cover',
});

export const previewContainer = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0f',
    position: 'relative',
    overflow: 'hidden',
});

export const canvas = style({
    maxWidth: '90%',
    maxHeight: '80%',
    backgroundColor: 'black',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
});

export const timelineContainer = style({
    backgroundColor: '#16162a',
    display: 'flex',
    flexDirection: 'column',
});

export const timelineToolbar = style({
    height: '40px',
    borderBottom: `1px solid ${vars.color.border.default}`,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    gap: '16px',
});

export const timelineTracks = style({
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden', // Scroll handled by specific container
    position: 'relative',
});

export const track = style({
    height: '60px',
    borderBottom: '1px solid #282839',
    position: 'relative',
    display: 'flex',
});

export const trackHeader = style({
    width: '120px',
    borderRight: '1px solid #282839',
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    fontSize: '12px',
    backgroundColor: '#1a1a2e',
    zIndex: 2,
    flexShrink: 0,
});

export const trackContent = style({
    flex: 1,
    position: 'relative',
    backgroundColor: '#13131f',
});

export const clip = style({
    position: 'absolute',
    height: '100%',
    top: 0,
    backgroundColor: vars.color.primary.main,
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.2)',
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    fontSize: '12px',
    color: 'white',
    whiteSpace: 'nowrap',
});

export const playhead = style({
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: '#ff4444',
    zIndex: 10,
    pointerEvents: 'none',
    '::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-5px',
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '10px solid #ff4444',
    }
});

export const ruler = style({
    height: '24px',
    borderBottom: '1px solid #282839',
    backgroundColor: '#1a1a2e',
    position: 'sticky',
    top: 0,
    zIndex: 3,
});

export const button = style({
    padding: '8px 16px',
    borderRadius: '4px',
    border: '1px solid #333',
    background: '#222',
    color: 'white',
    cursor: 'pointer',
});
