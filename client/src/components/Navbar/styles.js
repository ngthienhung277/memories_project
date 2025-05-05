import { AppBar, Typography, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

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

export const BrandContainerStyled = styled('div')(({ theme }) => ({
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

export const ImageStyled = styled('img')(({ theme }) => ({
    marginLeft: '10px',
    marginRight: '15px',
    height: '60px',
}));

export const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
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

// Replacing `makeStyles` with `sx` prop for inline styling
