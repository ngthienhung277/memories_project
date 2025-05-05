// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    spacing: 8,
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2', // màu xanh mặc định
        },
        secondary: {
            main: '#dc004e', // màu đỏ
        },
    },
});

export default theme;
