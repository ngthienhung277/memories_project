import { styled } from '@mui/material/styles'; // styled vẫn dùng từ đây
import { makeStyles } from '@mui/styles'; // makeStyles từ @mui/styles

export const PostsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: theme.spacing(2),
}));

export default makeStyles((theme) => ({
    mainContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    smMargin: {
        margin: theme.spacing(1),
    },
    actionDiv: {
        textAlign: 'center',
    },
}));