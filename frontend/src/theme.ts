import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#fbbf24', // Gold
        },
        secondary: {
            main: '#1a237e', // Indigo
        },
        background: {
            default: '#020617',
            paper: '#0f172a',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
        h2: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 700,
                    padding: '10px 24px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                },
            },
        },
    },
});

export default theme;
