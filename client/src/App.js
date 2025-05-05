import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import PostDetails from './components/PostDetails/PostDetails';

import { getPosts } from './actions/posts';

const App = () => {
    const user = JSON.parse(localStorage.getItem('profile')) || null;
    console.log('Loaded user:', user);

    const [hasUser, setHasUser] = useState(!!user);
    const [currentId, setCurrentId] = useState(null);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getPosts(1));
    }, [dispatch]);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('profile')) || null;

        if (currentUser && !hasUser) {
            navigate('/posts');
            setHasUser(false);
        } else if (!currentUser && hasUser) {
            setHasUser(false);
        }
    }, [navigate, hasUser])
    return (
        <Container maxWidth="xl">
            <Navbar />
            <Routes>
                <Route path='/' element={<Navigate to="/posts" />} />
                <Route path='/posts' element={<Home currentId={currentId} setCurrentId={setCurrentId} />} />
                <Route path='/posts/search' element={<Home currentId={currentId} setCurrentId={setCurrentId} />} />
                <Route path='/posts/:id' exact element={<PostDetails />} />
                <Route path='/auth' element={!user ? <Auth /> : <Navigate to="/posts" />} />
            </Routes>
        </Container>
    );
};

export default App;
