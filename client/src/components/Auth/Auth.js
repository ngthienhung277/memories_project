import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from './icon.js';
import { signin, signup } from '../../actions/auth';
import { AUTH } from '../../constants/actionTypes';
import Input from './Input';
import axios from 'axios';
import { getPosts } from '../../actions/posts.js';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState(initialState);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            if (localStorage.getItem('profile')) {
                console.log('Fetching posts on mount...');
                await dispatch(getPosts(1));
            }
        };
        fetchPosts();
    }, [dispatch]);

    const handleShowPassword = () => setShowPassword(prev => !prev);

    const switchMode = () => {
        setForm(initialState);
        setIsSignup(prev => !prev);
        setShowPassword(false);
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let result;
            if (isSignup) {
                result = await dispatch(signup(form, navigate));
            } else {
                result = await dispatch(signin(form, navigate));
            }
            if (result?.payload) {
                console.log('Fetching posts after form login...');
                await dispatch(getPosts(1));
                navigate('/');
            }
        } catch (error) {
            console.error('Login/Signup Error:', error);
        }
    };

    const handleGoogleLoginSuccess = async (tokenResponse) => {
        try {
            setIsGoogleLoading(true);
            console.log('Google token response:', tokenResponse);

            const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                },
            });

            console.log('Google user info:', userInfoResponse.data);

            const result = {
                email: userInfoResponse.data.email,
                name: userInfoResponse.data.name,
                firstName: userInfoResponse.data.given_name,
                lastName: userInfoResponse.data.family_name,
                imageUrl: userInfoResponse.data.picture || 'http://localhost:5000/uploads/default-avatar.png',
                sub: userInfoResponse.data.sub,
            };

            console.log('Sending to server:', result);

            const { data } = await axios.post('http://localhost:5000/user/google', { result });
            console.log('Full response from server:', data);

            if (!data.token) {
                throw new Error('No token received from server');
            }

            const userData = {
                result: {
                    ...data.result,
                    imageUrl: result.imageUrl.startsWith('http') ? result.imageUrl : `http://localhost:5000${result.imageUrl}`,
                    firstName: result.firstName,
                    lastName: result.lastName,
                },
                token: data.token,
            };

            dispatch({ type: AUTH, data: userData });
            localStorage.setItem('profile', JSON.stringify(userData)); // Lưu thủ công

            console.log('Fetching posts after Google login...');
            await dispatch(getPosts(1));
            navigate('/');
        } catch (error) {
            console.error('Google Login Error:', error);
            if (error.response) {
                console.error('Server Error:', error.response.data);
            }
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const login = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: (error) => {
            console.error('Google Sign In Error:', error);
            console.log('Google Sign In was unsuccessful. Try again later.');
        },
        scope: 'profile email',
    });

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">{isSignup ? 'Sign up' : 'Sign in'}</Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        {isSignup && (
                            <>
                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                            </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                    </Grid>

                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>

                    <Button
                        fullWidth
                        startIcon={<GoogleIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => login()}
                        disabled={isGoogleLoading}
                        sx={{
                            mt: 2,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            padding: '10px 0',
                        }}
                    >
                        {isGoogleLoading ? 'Loading...' : 'Sign in with Google'}
                    </Button>

                    <Grid container justifyContent="flex-end">
                        <Grid>
                            <Button onClick={switchMode}>
                                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default Auth;