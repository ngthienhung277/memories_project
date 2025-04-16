import { styled } from '@mui/material/styles';
import { Card, CardActions, Typography } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    borderRadius: '15px',
    margin: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
}));

export const StyledOverlay = styled('div')({
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: 'white',
});

export const StyledOverlay2 = styled('div')({
    position: 'absolute',
    top: '20px',
    right: '20px',
    color: 'white',
});

export const StyledDetails = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px',
});

export const StyledTitle = styled(Typography)({
    padding: '0 16px',
});

export const StyledCardActions = styled(CardActions)({
    padding: '0 16px 8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
});
