import React, { useState } from 'react';
import { CardContent, CardMedia, Button, Typography } from '@mui/material';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deletePost, likePost } from '../../../actions/posts';
import { MoreHoriz, ThumbUpAlt, Delete, ThumbUpAltOutlined } from '@mui/icons-material';
import {
    StyledCard,
    StyledOverlay,
    StyledOverlay2,
    StyledDetails,
    StyledTitle,
    StyledCardActions
} from './styles';

const Post = ({ post, setCurrentId }) => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [likes, setLikes] = useState(post?.likes);
    // const navigate = useNavigate();

    const userId = user?.result?.googleId || user?.result?._id;
    const hasLikedPost = likes?.find((like) => like === userId);

    const handleLike = async () => {
        dispatch(likePost(post._id));

        if (hasLikedPost) {
            setLikes(likes.filter((id) => id !== userId));
        } else {
            setLikes([...likes, userId]);
        }
    };

    const Likes = () => {
        if (likes?.length > 0) {
            return likes.find((like) => like === userId)
                ? (
                    <>
                        <ThumbUpAlt fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}
                    </>
                ) : (
                    <>
                        <ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
                    </>
                );
        }

        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
    };

    if (!user?.result) {
        return (
            <Button size="small" color="primary" disabled>
                <ThumbUpAltOutlined fontSize="small" />&nbsp;Like
            </Button>
        )
    }

    return (
        <StyledCard>
            <CardMedia component="img" image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
            <StyledOverlay>
                <Typography variant="h6">{post.name}</Typography>
                <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
            </StyledOverlay>
            {(user?.result?._id === post?.creator || user?.result?.googleId === post?.creator) && (
                <StyledOverlay2>
                    <Button
                        style={{ color: 'white' }}
                        size="small"
                        onClick={() => setCurrentId(post._id)}
                    >
                        <MoreHoriz fontSize="default" />
                    </Button>
                </StyledOverlay2>
            )}
            <StyledDetails>
                <Typography variant="body2" color="textSecondary">{post.tags.map((tag) => `#${tag} `)}</Typography>
            </StyledDetails>
            <StyledTitle variant="h5" gutterBottom>{post.title}</StyledTitle>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
            </CardContent>
            <StyledCardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={handleLike}
                >
                    <Likes />
                </Button>
                {(user?.result?._id === post?.creator || user?.result?.googleId === post?.creator) && (
                    <Button size="small" color="error" onClick={() => dispatch(deletePost(post._id))}>
                        <Delete fontSize="small" /> Delete
                    </Button>
                )}
            </StyledCardActions>
        </StyledCard>
    );
};

export default Post;
