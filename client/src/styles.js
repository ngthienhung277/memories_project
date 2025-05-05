import { styled } from '@mui/material/styles';
import { AppBar, Typography, Toolbar, Avatar } from '@mui/material';

export const AppBarStyled = styled(AppBar)(({ theme }) => ({
    borderRadius: 15,
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 50px',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    },
}));

export const BrandContainerStyled = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
}));

export const HeadingStyled = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontSize: '2em',
    fontWeight: 300,
}));

export const ImageStyled = styled('img')(() => ({
    marginLeft: '10px',
    marginRight: '15px',
    height: '60px',
}));

export const ToolbarStyled = styled(Toolbar)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    margin: '0 auto',
}));

export const ProfileStyled = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    width: '400px',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
        width: 'auto',
        marginTop: 20,
        justifyContent: 'center',
    },
}));