import React, { useState, useEffect } from 'react';
import { Paper, TextField, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import fileToBase64 from '../../utils/fileToBase';

import { createPost, updatePost } from '../../actions/posts';
import { StyledForm, StyledPaper, FileInputWrapper, SubmitButton } from './styles';

const Form = ({ currentId, setCurrentId }) => {
    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: '',
        selectedFile: '',
    });

    const post = useSelector((state) =>
        currentId ? state.posts.find((message) => message._id === currentId) : null
    );

    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        if (post) setPostData(post);
    }, [post]);

    const clear = () => {
        setCurrentId(null);
        setPostData({ title: '', message: '', tags: '', selectedFile: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentId) {
            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
        } else {
            dispatch(createPost({ ...postData, name: user?.result?.name }));
        }
        clear();
    };

    if (!user?.result?.name) {
        return (
            <Paper>
                <Typography variant="h6" align="center">
                    Please Sign In to create your own memories and like other's memories.
                </Typography>
            </Paper>
        );
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setPostData({ ...postData, selectedFile: base64 });
        }
    };

    return (
        <StyledPaper elevation={6}>
            <StyledForm autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Typography variant="h6">
                    {currentId ? `Editing "${post?.title}"` : 'Creating a Memory'}
                </Typography>

                <TextField
                    name="title"
                    variant="outlined"
                    label="Title"
                    fullWidth
                    value={postData.title}
                    onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                />

                <TextField
                    name="message"
                    variant="outlined"
                    label="Message"
                    fullWidth
                    multiline
                    rows={4}
                    value={postData.message}
                    onChange={(e) => setPostData({ ...postData, message: e.target.value })}
                />

                <TextField
                    name="tags"
                    variant="outlined"
                    label="Tags (comma separated)"
                    fullWidth
                    value={postData.tags}
                    onChange={(e) =>
                        setPostData({ ...postData, tags: e.target.value.split(', ').map(tag => tag.trim()) })
                    }
                />

                <FileInputWrapper>
                    <input type="file" onChange={handleFileChange} />
                </FileInputWrapper>

                <SubmitButton variant="contained" color="primary" size="large" type="submit" fullWidth>
                    {currentId ? 'Update' : 'Submit'}
                </SubmitButton>

                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>
                    Clear
                </Button>
            </StyledForm>
        </StyledPaper>
    );
};

export default Form;
