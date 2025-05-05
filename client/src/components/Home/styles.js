import { styled } from '@mui/material/styles';
import { Box, Grid, Pagination } from '@mui/material';

export const AppBarSearchStyled = styled(Box)(({ theme }) => ({
    borderRadius: 4,
    marginBottom: '1rem',
    display: 'flex',
    padding: '16px',
}));

export const PaginationStyled = styled(Pagination)(({ theme }) => ({
    borderRadius: 4,
    marginTop: '1rem',
    padding: '16px',
}));

export const GridContainerStyled = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('xs')]: {
        flexDirection: 'column-reverse',
    },
}));
