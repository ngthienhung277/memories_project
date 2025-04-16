import React, { useState, useEffect } from 'react';
import { Container, AppBar, Typography, Grow, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';

import { getPosts } from './actions/posts';
import Posts from './components/Posts/Posts';
import Form from './components/Form/Form';
import memories from './images/memories.png';

const App = () => {
    const [currentId, setCurrentId] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPosts());
    }, [currentId, dispatch]);

    return (
        <Container maxWidth="lg">
            <AppBar
                position="static"
                color="inherit"
                sx={{
                    borderRadius: 2,
                    m: '30px 0',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                }}
            >
                <Typography
                    variant="h2"
                    align="center"
                    sx={{ color: 'rgba(0,183,255,1)', flex: 1 }}
                >
                    Memories
                </Typography>
                <img src={memories} alt="memories" height="60" style={{ marginLeft: '15px' }} />
            </AppBar>
            <Grow in>
                <Container>
                    <Grid
                        container
                        direction={{ xs: 'column-reverse', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems="stretch"
                        spacing={3}
                    >
                        <Grid size={{ xs: 12, sm: 7 }}>
                            <Posts setCurrentId={setCurrentId} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Form currentId={currentId} setCurrentId={setCurrentId} />
                        </Grid>
                    </Grid>
                </Container>
            </Grow>
        </Container>
    );
};

export default App;
