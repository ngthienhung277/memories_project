import { styled } from '@mui/material/styles';
import { Card, CardMedia, ButtonBase, CardActions, Typography } from '@mui/material';

// Styled Card
export const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 16,
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
}));

export const StyledButtonBase = styled(ButtonBase)({
    display: 'block',
    textAlign: 'initial',
    width: "100%",
    height: '100%',
})

export const StyledMedia = styled(CardMedia)({
    height: 0,
    paddingTop: '56.25%', // 16:9 ratio
    backgroundBlendMode: 'darken',
    backgroundColor: 'rgba(0,0,0,0.4)',
    transition: 'all 0.3s ease'
});

// Overlay bên trái (tên + thời gian)

export const StyledOverlay = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    color: 'white',
}));

// Overlay bên phải (button MoreHoriz)
export const StyledOverlay2 = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    color: 'white',
}));

export const StyledDetails = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(2)
}));

// Title (tựa bài post)
export const StyledTitle = styled(Typography)(({ theme }) => ({
    padding: '0 16px',
    fontWeight: 'bold',
    wordBreak: 'break-word',
}));

// CardActions (nút like và delete)
export const StyledCardActions = styled(CardActions)(({ theme }) => ({
    padding: '0 16px 8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
}));

// export default makeStyles({
//     media: {
//         height: 0,
//         paddingTop: '56.25%',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         backgroundBlendMode: 'darken',
//     },
//     border: {
//         border: 'solid',
//     },
//     fullHeightCard: {
//         height: '100%',
//     },
//     card: {
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         borderRadius: '15px',
//         height: '100%',
//         position: 'relative',
//     },
//     overlay: {
//         position: 'absolute',
//         top: '20px',
//         left: '20px',
//         color: 'white',
//     },
//     overlay2: {
//         position: 'absolute',
//         top: '20px',
//         right: '20px',
//         color: 'white',
//     },
//     grid: {
//         display: 'flex',
//     },
//     details: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         margin: '20px',
//     },
//     title: {
//         padding: '0 16px',
//     },
//     cardActions: {
//         padding: '0 16px 8px 16px',
//         display: 'flex',
//         justifyContent: 'space-between',
//     },
//     cardAction: {
//         display: 'block',
//         textAlign: 'initial',
//     },

// });
