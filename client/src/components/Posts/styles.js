import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

export const PostsContainer = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
}));
