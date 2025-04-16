import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

// Custom Paper
export const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
}));

// Form container
export const StyledForm = styled('form')(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    '& .MuiTextField-root': {
        margin: theme.spacing(1),
    },
}));

// File input wrapper
export const FileInputWrapper = styled('div')({
    width: '97%',
    margin: '10px 0',
});

// Submit button
export const SubmitButton = styled(Button)({
    marginBottom: 10,
});
