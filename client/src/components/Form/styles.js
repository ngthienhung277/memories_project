// FormStyles.js
import { styled } from '@mui/system';
import { Paper, Button } from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
}));

export const StyledForm = styled('form')(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(2), // dùng spacing cho đồng bộ
}));

export const FileInputWrapper = styled('div')(({ theme }) => ({
    width: '97%',
    margin: theme.spacing(1, 0), // tương đương '8px 0'
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(1.25), // 10px
}));

export const FormRoot = styled('div')(({ theme }) => ({
    '& .MuiTextField-root': {
        margin: theme.spacing(1),
    },
}));
