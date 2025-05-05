import React, { useState, useEffect, useCallback } from 'react';
import { Paper, TextField, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import fileToBase64 from '../../utils/fileToBase';
import { createPost, updatePost } from '../../actions/posts';
import { StyledForm, StyledPaper, FileInputWrapper, SubmitButton } from './styles';

const Form = ({ currentId, setCurrentId }) => {
    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: [],
        selectedFile: '',
        name: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));
    const post = useSelector((state) =>
        currentId ? state.posts.posts.find((p) => p._id === currentId) : null
    );

    useEffect(() => {
        if (post) setPostData(post);
    }, [post]);

    const clear = useCallback(() => {
        setCurrentId(null);
        setPostData({ title: '', message: '', tags: '', selectedFile: '' });
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    }, [setCurrentId]);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            if (!user?.result) {
                console.log('User not authenticated');
                return;
            }

            const payload = { ...postData, name: user?.result?.name };

            try {
                if (currentId) {
                    await dispatch(updatePost(currentId, payload));
                    clear();
                } else {
                    const createdPost = await dispatch(createPost(payload)); // Lấy kết quả từ dispatch
                    console.log('Created post result:', createdPost); // Debug dữ liệu
                    if (createdPost && createdPost.payload && createdPost.payload._id) {
                        navigate(`/posts/${createdPost.payload._id}`); // Chuyển hướng nếu có _id
                    } else {
                        console.error('Invalid createdPost data:', createdPost);
                    }
                    clear();
                }
            } catch (error) {
                console.error('Error submitting post:', error);
            }
        },
        [dispatch, postData, user, currentId, clear, navigate]
    );

    const handleFileChange = useCallback(async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }
            const base64 = await fileToBase64(file);
            setPostData((prev) => ({ ...prev, selectedFile: base64 }));
        }
    }, []);

    if (!user?.result?.name) {
        return (
            <Paper elevation={3} sx={{ padding: '16px' }}>
                <Typography variant="h6" align="center">
                    Please Sign In to create your own memories and like other's memories.
                </Typography>
            </Paper>
        );
    }

    return (
        <Box p={2}>
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
                            setPostData({ ...postData, tags: e.target.value.split(/,\s*/).map((tag) => tag.trim()) })
                        }
                    />

                    <FileInputWrapper>
                        <input type="file" onChange={handleFileChange} />
                    </FileInputWrapper>

                    <SubmitButton variant="contained" color="primary" size="large" type="submit" fullWidth>
                        {currentId ? 'Update' : 'Submit'}
                    </SubmitButton>

                    <SubmitButton variant="contained" color="secondary" size="small" onClick={clear} fullWidth>
                        Clear
                    </SubmitButton>
                </StyledForm>
            </StyledPaper>
        </Box>
    );
};

export default Form;