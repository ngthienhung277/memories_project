import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination'
export const StyledPagination = styled(Pagination)(({ theme }) => ({
    '& ul': {
        justifyContent: 'space-around',
    },
}));