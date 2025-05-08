import React, { useEffect } from 'react';
import { Paper, Typography, CircularProgress, Divider, CardMedia } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';

import CommentSection from './CommentSection';
import { getPost, getPostsBySearch } from '../../actions/posts';
import { CardStyled, ImageSection, LoadingPaper, RecommendedPosts, Section } from './styles';

const PostDetails = () => {
    const { post, posts, isLoading } = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        console.log('🚀 useEffect calling getPost with id:', id);
        if (id) {
            dispatch(getPost(id));
        } else {
            console.error('No id provided in params');
            navigate('/')
        }
    }, [id, navigate, dispatch]);

    useEffect(() => {
        if (post && post.tags) {
            console.log('Post loaded:', post);
            dispatch(getPostsBySearch({ search: 'none', tags: post.tags.join(',') }));
        } else {
            console.warn('Post or post.tags is undefined:', post);
        }
    }, [post, dispatch]);

    if (isLoading) {
        return (
            <LoadingPaper elevation={6}>
                <CircularProgress size="7em" />
            </LoadingPaper>
        );
    }

    if (!post || !post._id) {
        console.warn('Post not found or invalid:', post);
        return (
            <Typography variant="h6" color="error">
                Post not found or invalid.
            </Typography>
        );
    }

    const openPost = (_id) => {
        if (_id) {
            console.log('Navigating to:', `/posts/${_id}`);
            navigate(`/posts/${_id}`);
        } else {
            console.error('Invalid _id in openPost:', _id);
        }
    };

    const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

    return (
        <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
            <CardStyled>
                <Section>
                    <Typography variant="h3" component="h2">{post.title}</Typography>
                    <Typography gutterBottom variant="h6" color="textSecondary" component="h2">
                        {post.tags.map((tag) => `#${tag} `)}
                    </Typography>
                    <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
                    <Typography variant="h6">Created by: {post.name}</Typography>
                    <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
                    <Divider style={{ margin: '20px 0' }} />
                    <Typography variant="body1">
                        <strong>Realtime Chat - coming soon!</strong>
                    </Typography>
                    <Divider style={{ margin: '20px 0' }} />
                    <CommentSection postId={post._id} />
                    <Divider style={{ margin: '20px 0' }} />
                </Section>
                <ImageSection>
                    <CardMedia
                        component="img"
                        src={post.selectedFile && post.selectedFile !== '' ? post.selectedFile : 'http://localhost:5000/uploads/memories.png'}
                        alt={post.title}
                        onError={(e) => {
                            console.error('Image failed to load:', e.target.src);
                            e.target.src = 'http://localhost:5000/uploads/memories.png'; // Fallback
                        }}
                    />
                </ImageSection>
            </CardStyled>
            {!!recommendedPosts.length && (
                <Section>
                    <Typography gutterBottom variant="h5">You might also like:</Typography>
                    <Divider />
                    <RecommendedPosts>
                        {recommendedPosts.map(({ title, name, message, likes, selectedFile, _id }) => (
                            <div
                                key={_id}
                                style={{
                                    margin: '20px',
                                    cursor: 'pointer',
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                }}
                                onClick={() => openPost(_id)}
                            >
                                <Typography gutterBottom variant="h6" noWrap>
                                    {title}
                                </Typography>
                                <Typography gutterBottom variant="subtitle2" noWrap>
                                    {name}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="subtitle2"
                                    sx={{
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 2,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {message}
                                </Typography>
                                <Typography gutterBottom variant="subtitle1">
                                    Likes: {likes.length}
                                </Typography>
                                <img
                                    src={selectedFile && selectedFile !== '' && selectedFile !== '/server/uploads/memories.png' ? selectedFile : 'http://localhost:5000/uploads/memories.png'}
                                    alt={title}
                                    style={{
                                        width: '100%',
                                        maxHeight: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                    onError={(e) => {
                                        console.error('Recommended image failed to load:', e.target.src);
                                        e.target.src = 'http://localhost:5000/uploads/memories.png'; // Fallback
                                    }}
                                />
                            </div>
                        ))}
                    </RecommendedPosts>
                </Section>
            )}
        </Paper>
    );
};

export default PostDetails;