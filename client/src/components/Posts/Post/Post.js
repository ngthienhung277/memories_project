import React from 'react';
import { Typography, Button, CardContent, Box } from '@mui/material';
import { ThumbUp, ThumbUpAltOutlined, Delete, MoreHoriz } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { likePost, deletePost } from '../../../actions/posts';
import {
    StyledCard,
    StyledButtonBase,
    StyledMedia,
    StyledOverlay,
    StyledOverlay2,
    StyledTitle,
    StyledCardActions,
} from './styles';

const Likes = ({ likes, userId }) => {
    console.log('Likes array:', likes, 'User ID:', userId);
    const hasLikedPost = likes?.includes(userId);
    console.log('Has liked post:', hasLikedPost);

    if (!likes?.length) return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThumbUpAltOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
            0 Like
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThumbUp fontSize="small" sx={{ color: hasLikedPost ? '#1565c0' : 'text.secondary' }} />
            {hasLikedPost
                ? likes.length === 1
                    ? 'YOU'
                    : `YOU AND ${likes.length - 1} OTHER${likes.length - 1 !== 1 ? 'S' : ''}`
                : `${likes.length} ${likes.length > 1 ? 'LIKES' : 'LIKE'}`}
        </Box>
    );
};

const Post = ({ post, setCurrentId }) => {
    console.log('🔄 Post data:', post);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));
    console.log('User from localStorage:', user);
    const userId = user?.result?._id;
    console.log('User ID:', userId, 'Post Creator:', post?.creator);
    const isCreator = userId && post?.creator ? userId === post.creator : false;

    const openPost = (e) => {
        e.preventDefault(); // Ngăn hành vi mặc định (refresh)
        e.stopPropagation(); // ngan su kien lan truyen
        if (post?._id) {
            console.log('Navigating to:', `/posts/${post._id}`);
            navigate(`/posts/${post._id}`, { replace: false });
        } else {
            console.log('Post ID is undefined', post)
        }
    }


    if (!post || !post._id) {
        console.warn('Invalid post data:', post);
        return (
            <StyledCard elevation={6} sx={{ padding: '16px', textAlign: 'center' }}>
                <Typography variant="body2" color="error">
                    Error: Post data is invalid or missing.
                </Typography>
            </StyledCard>
        );
    }

    return (
        <StyledCard
            elevation={6}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '16px',
                overflow: 'hidden',
                width: { xs: '90vw', sm: '300px', md: '300px' },
                minWidth: '300px',
                minHeight: '400px', // Đảm bảo chiều cao tối thiểu
                margin: 'auto',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.015)',
                },
            }}
        >
            <StyledButtonBase onClick={openPost} sx={{ flexGrow: 1, position: 'relative' }} component="div">
                <StyledMedia
                    image={post.selectedFile || 'https://via.placeholder.com/300'}
                    title={post.title}
                    sx={{ height: { xs: '150px', sm: '180px' }, objectFit: 'cover' }} // Điều chỉnh height theo responsive
                />
                <StyledOverlay sx={{ padding: '16px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <Typography
                            variant="h6"
                            color="white"
                            fontWeight={600}
                            sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',
                            }}
                        >
                            {post.name || 'Unknown'}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="white"
                            sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',
                            }}
                        >
                            {moment(post.createdAt).fromNow()}
                        </Typography>
                    </Box>
                </StyledOverlay>

                {isCreator && (
                    <StyledOverlay2>
                        <Button
                            sx={{ color: 'white', minWidth: 'unset' }}
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentId(post._id);
                            }}
                        >
                            <MoreHoriz fontSize="default" />
                        </Button>
                    </StyledOverlay2>
                )}
            </StyledButtonBase>

            <CardContent sx={{ padding: '16px', flexGrow: 1, minHeight: '180px' }}>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                    }}
                >
                    {post.tags.map((tag) => `#${tag} `)}
                </Typography>

                <StyledTitle
                    variant="h6"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                    }}
                >
                    {post.title}
                </StyledTitle>

                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3, // Giới hạn 3 dòng như trong hình
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                    }}
                >
                    {post.message}
                </Typography>
            </CardContent>

            <StyledCardActions sx={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    size="small"
                    color="primary"
                    disabled={!user?.result}
                    onClick={() => dispatch(likePost(post._id))}
                >
                    <Likes likes={post.likes} userId={userId} />
                </Button>

                {isCreator && (
                    <Button
                        size="small"
                        color="secondary"
                        onClick={() => dispatch(deletePost(post._id))}
                    >
                        <Delete fontSize="small" />
                        Delete
                    </Button>
                )}
            </StyledCardActions>
        </StyledCard>
    );
};

export default Post;