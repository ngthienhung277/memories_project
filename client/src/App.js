import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';

import { getPosts } from './actions/posts';

const App = () => {
    const [currentId, setCurrentId] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPosts());
    }, [currentId, dispatch]);

    return (
        <Container maxWidth="lg">
            <Navbar />
            <Routes>
                <Route path='/' element={<Home currentId={currentId} setCurrentId={setCurrentId} />} />
                <Route path='/auth' element={<Auth />} />
            </Routes>
        </Container>
    );
};

export default App;
