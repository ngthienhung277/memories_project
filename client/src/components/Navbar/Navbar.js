import React, { useState, useEffect, useCallback } from 'react';
import { Box, AppBar, Typography, Avatar, Button } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

import memories from '../../images/memories.png';
import * as actionType from '../../constants/actionTypes';
import { BrandContainerStyled, ToolbarStyled, HeadingStyled, ImageStyled, ProfileStyled } from './styles';
import { deepPurple } from '@mui/material/colors';

const Navbar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    const logout = useCallback(() => {
        dispatch({ type: actionType.LOGOUT });
        navigate('/auth');
        setUser(null);
    }, [dispatch, navigate]);

    useEffect(() => {
        const token = user?.token;

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log('decodedToken', decodedToken);

                if (decodedToken.exp * 1000 < new Date().getTime()) {
                    logout();
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }
    }, [logout, user]);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const displayName = user?.result?.firstName && user?.result?.lastName
        ? `${user.result.firstName} ${user.result.lastName}`
        : user?.result?.name || 'User';

    return (
        <AppBar position="static" color="inherit"
            sx={{
                borderRadius: 2,
                margin: '30px 0',
                padding: '10px 30px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
            <BrandContainerStyled>
                <HeadingStyled
                    variant="h2"
                    align="center"
                    style={{ color: '#333', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif', textDecoration: 'none' }}
                    as={Link}
                    to="/"
                >
                    Memories
                </HeadingStyled>
                <ImageStyled src={memories} alt="icon" height="60" sx={{ marginLeft: '15px' }} />
            </BrandContainerStyled>

            <ToolbarStyled>
                {user?.result ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '2' }}>
                        <ProfileStyled>
                            <Avatar
                                sx={{
                                    backgroundColor: deepPurple[500],
                                    marginRight: '10px',
                                    width: 40,
                                    height: 40
                                }}
                                alt={displayName}
                                src={user?.result.imageUrl}
                                onError={(e) => {
                                    console.log('Avatar load error for user:', user?.result);
                                    e.target.onerror = null;
                                    e.target.src = '';
                                }}
                            >
                                {displayName.charAt(0)}
                            </Avatar>
                            <Typography
                                sx={{
                                    fontWeight: '500',
                                    marginRight: '10px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                variant="h6"
                                component="span"
                            >
                                {displayName}
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                sx={{
                                    backgroundColor: '#f44336',
                                    '&:hover': { backgroundColor: '#d32f2f' },
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    padding: '6px 16px'
                                }}
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </ProfileStyled>
                    </Box>
                ) : (
                    <Button
                        component={Link}
                        to="/auth"
                        variant="contained"
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#1565c0' },
                        }}
                    >
                        Sign In
                    </Button>
                )}
            </ToolbarStyled>
        </AppBar>
    );
};

export default Navbar; 