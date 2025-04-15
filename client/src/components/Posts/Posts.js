import React from 'react';
import { Grid, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

import Post from './Post/Post';
import { PostsContainer } from './styles';

const Posts = ({ setCurrentId }) => {
    const posts = useSelector((state) => state.posts);

    return (
        !posts.length ? <CircularProgress /> : (
            <PostsContainer container alignItems="stretch" spacing={3}>
                {posts.map((post) => (
                    <Grid key={post._id} size={{ xs: 12, sm: 6, md: 6 }}>
                        <Post post={post} setCurrentId={setCurrentId} />
                    </Grid>
                ))}
            </PostsContainer>
        )
    )
}

export default Posts;
