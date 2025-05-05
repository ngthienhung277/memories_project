import React, { useEffect } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../../actions/posts';

import Post from './Post/Post';
import { PostsContainer } from './styles';

const Posts = ({ setCurrentId }) => {
    const { posts, isLoading } = useSelector((state) => state.posts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPosts(1));
    }, [dispatch]);

    if (isLoading) {
        return <CircularProgress />;
    }

    if (!Array.isArray(posts) || !posts?.length) {
        return <div>No posts found.</div>;
    }

    return (
        <PostsContainer>
            <Grid container spacing={3} sx={{ padding: 2 }}>
                {posts.map((post) => (
                    <Grid key={post._id} size={{ xs: '12', sm: '6', md: '4' }}>
                        <Post key={post._id} post={post} setCurrentId={setCurrentId} />
                    </Grid>
                ))}
            </Grid>
        </PostsContainer>
    );
}

export default Posts;
