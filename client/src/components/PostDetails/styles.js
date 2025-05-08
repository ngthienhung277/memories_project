// styles.js
import { Paper } from '@mui/material';
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
    flexDirection: 'row',
    gap: '20px',
    flexWrap: 'wrap'
}));

export const Section = styled('div')({
    flex: '0 0 55%',
    borderRadius: '20px',
    margin: '10px',
    '@media (max - width: 600px)': {
        flex: '0 0 100%',
    }
});

export const ImageSection = styled('div')(({ theme }) => ({
    marginLeft: '20px',
    [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        flex: '0 0 100%',
    },
    flex: '0 0 40%'
}));

export const RecommendedPosts = styled('div')({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    overflowY: 'auto',
    maxHeight: '300px',
    '@media (max-width: 600px)': {
        flexDirection: 'column',
    },
});

export const LoadingPaper = styled(Paper)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '15px',
    height: '39vh',
});

export const CommentsOuterContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between'
})

export const CommentsInnerContainer = styled('div')({
    height: '200px',
    overflowY: 'auto',
    marginRight: '30px',
})