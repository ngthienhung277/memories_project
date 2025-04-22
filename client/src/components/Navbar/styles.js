import { styled } from '@mui/system';
import { deepPurple } from '@mui/material/colors';

// Styled components for MUI v5
export const AppBarStyled = styled('div')(({ theme }) => ({
    borderRadius: 15,
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 50px',
}));

export const HeadingStyled = styled('a')({
    color: 'rgba(0,183,255, 1)',
    textDecoration: 'none',
});

export const ImageStyled = styled('img')({
    marginLeft: '15px',
});

export const ToolbarStyled = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end',
    width: '400px',
});

export const ProfileStyled = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    width: '400px',
});

export const UserNameStyled = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

export const BrandContainerStyled = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

export const PurpleStyled = styled('div')({
    color: '#fff',
    backgroundColor: deepPurple[500],
});

