import React, { useState } from 'react';
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

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Toggle password visibility
    const handleShowPassword = () => setShowPassword(prev => !prev);

    // Switch between sign up and sign in
    const switchMode = () => {
        setForm(initialState);
        setIsSignup(prev => !prev);
        setShowPassword(false);
    };

    // Handle form input change
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // Handle form submission (sign in or sign up)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            dispatch(signup(form, navigate));
        } else {
            dispatch(signin(form, navigate));
        }
    };

    // Handle Google login success
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
                imageUrl: userInfoResponse.data.picture,
                sub: userInfoResponse.data.sub
            };

            console.log('Sending to server:', result);

            // Gửi thông tin user đến server để xác thực
            const { data } = await axios.post('http://localhost:5000/user/google', { result });
            console.log('Server auth response:', data);

            if (!data.token) {
                throw new Error('No token received from server');
            }

            // Lưu token riêng để dễ truy cập
            localStorage.setItem('token', data.token);

            // Dispatch action với token từ server
            dispatch({
                type: AUTH,
                data: {
                    result: {
                        ...data.result,
                        imageUrl: result.imageUrl, // Đảm bảo imageUrl từ Google được lưu
                        firstName: result.firstName,
                        lastName: result.lastName
                    },
                    token: data.token
                }
            });

            navigate('/');
        } catch (error) {
            console.error("Google Login Error:", error);
            if (error.response) {
                console.error("Server Error:", error.response.data);
            }
        } finally {
            setIsGoogleLoading(false);
        }
    };

    // Google login hook
    const login = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: (error) => {
            console.error('Google Sign In Error:', error);
            alert('Google Sign In was unsuccessful. Try again later.');
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
