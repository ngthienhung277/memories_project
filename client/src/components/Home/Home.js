import React from 'react';
import { Container, Grow, Grid } from '@mui/material';

import Posts from '../Posts/Posts';
import Form from '../Form/Form';

const Home = ({ currentId, setCurrentId }) => {
    return (
        <Grow in>
            <Container>
                <Grid container justifyContent="space-between" alignItems="stretch" spacing={3}>
                    <Grid size={{ xs: 12, sm: 7 }} >
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Form currentId={currentId} setCurrentId={setCurrentId} />
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    );
};

export default Home;
