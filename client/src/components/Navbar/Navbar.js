import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, AppBar, Typography, Avatar, Button } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

import memoriesLogo from '../../images/memories-Logo.png';
import memoriesText from '../../images/memories-Text.png';
import * as actionType from '../../constants/actionTypes';
import { deepPurple } from '@mui/material/colors';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    console.log('Navbar loaded user:', localStorage.getItem('profile'));

    const logout = useCallback(() => {
        dispatch({ type: actionType.LOGOUT });
        localStorage.clear();
        dispatch({ type: 'CLEAR_POSTS' });
        localStorage.removeItem('profile');
        navigate('/auth', { replace: true }); // Điều hướng về trang đăng nhập      
        setUser(null);
    }, [dispatch, navigate]);

    const getAvatarSrc = () => {
        if (!user || !user.result || !user.result.imageUrl || user.result.imageUrl === '') {
            console.warn('No valid imageUrl, using default:', user?.result?.imageUrl);
            return 'http://localhost:5000/uploads/default-avatar.png'; // Hình ảnh mặc định
        }
        let imageUrl = user.result.imageUrl;
        if (!imageUrl.includes('http')) {
            console.warn('Invalid imageUrl, prepending base URL:', imageUrl);
            imageUrl = `http://localhost:5000${imageUrl}`; // Thêm base URL nếu cần
        }
        console.log('Computed avatar src:', imageUrl);
        return imageUrl;
    };

    const decodedToken = useMemo(() => {
        try {
            const token = user?.token;
            return token ? jwtDecode(token) : null;
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    }, [user?.token]);

    useEffect(() => {
        if (decodedToken && decodedToken.exp * 1000 < new Date().getTime()) {
            logout();
        }
    }, [decodedToken, logout]);

    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('profile'));
        console.log('Updated user from localStorage:', profile);
        setUser(profile);
    }, [location]);

    const displayName = useMemo(() => {
        return user?.result?.firstName && user?.result?.lastName
            ? `${user.result.firstName} ${user.result.lastName}`
            : user?.result?.name || 'User';
    }, [user]);

    return (
        <AppBar
            position="static"
            color="inherit"
            sx={{
                borderRadius: 2,
                m: '30px 0',
                p: '10px 30px',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
        >
            <Link to="/">
                <img src={memoriesText} alt="icon" height="45px" style={{ marginRight: '16px' }} />
                <img src={memoriesLogo} alt="icon" height="40px" />
            </Link>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {user?.result ? (
                    <>
                        <Avatar
                            sx={{
                                backgroundColor: deepPurple[500],
                                mr: 2,
                                width: 40,
                                height: 40,
                            }}
                            alt={displayName}
                            src={getAvatarSrc()}
                            onError={(e) => {
                                e.target.onerror = null; // Ngăn lặp vô hạn
                                console.error('Avatar image failed to load:', e.target.src);
                                e.target.src = 'http://localhost:5000/uploads/memories.png'; // Fallback
                            }}
                        >
                            {displayName.charAt(0)}
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 500, mr: 2 }}>
                            {displayName}
                        </Typography>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={logout}
                            sx={{
                                backgroundColor: '#f44336',
                                '&:hover': { backgroundColor: '#d32f2f' },
                                borderRadius: 2,
                                textTransform: 'none',
                                padding: '8px 16px',
                            }}
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="contained"
                        component={Link}
                        to="/auth"
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#1565c0' },
                            borderRadius: 2,
                            textTransform: 'none',
                            padding: '8px 16px',
                        }}
                        onClick={() => navigate('/auth')}
                    >
                        Sign In
                    </Button>
                )}
            </Box>
        </AppBar>
    );
};

export default Navbar;