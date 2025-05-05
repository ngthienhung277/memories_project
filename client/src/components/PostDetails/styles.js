// styles.js
import { styled } from '@mui/material/styles';

export const Media = styled('img')(({ theme }) => ({
    borderRadius: '20px',
    objectFit: 'cover',
    width: '100%',
    maxHeight: '600px',
}));

export const CardStyled = styled('div')(({ theme }) => ({
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        flexWrap: 'wrap',
        flexDirection: 'column',
    },
}));

export const Section = styled('div')({
    borderRadius: '20px',
    margin: '10px',
    flex: 1,
});

export const ImageSection = styled('div')(({ theme }) => ({
    marginLeft: '20px',
    [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
    },
}));

export const RecommendedPosts = styled('div')(({ theme }) => ({
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    },
}));

export const LoadingPaper = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '15px',
    height: '39vh',
});
