import React from 'react';
import { CardContent, CardMedia, Button, Typography } from '@mui/material';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deletePost, likePost } from '../../../actions/posts';
import { MoreHoriz, ThumbUpAlt, Delete } from '@mui/icons-material';
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

    return (
        <StyledCard>
            <CardMedia component="img" image={post.selectedFile} title={post.title} />
            <StyledOverlay>
                <Typography variant="h6">{post.creator}</Typography>
                <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
            </StyledOverlay>
            <StyledOverlay2>
                <Button
                    style={{ color: 'white' }}
                    size="small"
                    onClick={() => setCurrentId(post._id)}
                >
                    <MoreHoriz fontSize="default" />
                </Button>
            </StyledOverlay2>
            <StyledDetails>
                <Typography variant="body2" color="textSecondary">{post.tags.map((tag) => `#${tag} `)}</Typography>
            </StyledDetails>
            <StyledTitle variant="h5" gutterBottom>{post.title}</StyledTitle>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
            </CardContent>
            <StyledCardActions>
                <Button size="small" color="primary" onClick={() => dispatch(likePost(post._id))}>
                    <ThumbUpAlt fontSize="small" /> &nbsp; Like &nbsp; {post.likeCount}
                </Button>
                <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))}>
                    <Delete fontSize="small" /> Delete
                </Button>
            </StyledCardActions>
        </StyledCard>
    )
}

export default Post;
