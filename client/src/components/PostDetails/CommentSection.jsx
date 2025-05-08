import React, { useState, useRef, useEffect } from 'react';
import { Typography, TextField, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'; // Thêm useSelector để lấy post từ Redux
import { CommentsInnerContainer, CommentsOuterContainer } from './styles';
import { commentPost } from '../../actions/posts';

const ComponentSection = ({ post: initialPost }) => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [comment, setComment] = useState('');
    const commentsRef = useRef();

    // Lấy post từ Redux để đảm bảo đồng bộ
    const { post } = useSelector((state) => state.posts);

    // Cập nhật comments khi post thay đổi
    useEffect(() => {
        if (post?.comments && Array.isArray(post.comments)) {
            setComments(post.comments);
        }
    }, [post]);

    const [comments, setComments] = useState(() => {
        return Array.isArray(initialPost?.comments) ? [...initialPost.comments] : [];
    });

    const handleComment = async () => {
        if (!post?._id || !user?.result?.name || !comment.trim()) {
            console.warn('Cannot comment: Missing post ID, user name, or empty comment');
            return;
        }

        try {
            const newComment = `${user.result.name}: ${comment.trim()}`;
            const updatedComments = await dispatch(commentPost(newComment, post._id));

            if (updatedComments) {
                setComments((prevComments) => [...prevComments, newComment]); // Cập nhật cục bộ
            }
            setComment('');
            commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    return (
        <CommentsOuterContainer>
            <CommentsInnerContainer>
                <Typography gutterBottom variant="h6">
                    Comments
                </Typography>
                {Array.isArray(comments) && comments.length > 0 ? (
                    comments.map((c, i) => {
                        const [name, content] = c.split(': ', 2);
                        return (
                            <Typography key={i} gutterBottom variant="subtitle1">
                                <strong>{name || 'Anonymous'}</strong>: &nbsp;
                                {content || c}
                            </Typography>
                        );
                    })
                ) : (
                    <Typography variant="subtitle1">No comments yet</Typography>
                )}
                <div ref={commentsRef} />
            </CommentsInnerContainer>
            {user?.result?.name && (
                <div style={{ width: '70%' }}>
                    <Typography gutterBottom variant="h6">
                        Write a Comment
                    </Typography>
                    <TextField
                        fullWidth
                        rows={4}
                        variant="outlined"
                        label="Comment"
                        multiline
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{ mb: 2 }} // Thêm margin bottom cho khoảng cách
                    />
                    <Button
                        fullWidth
                        disabled={!comment.trim().length}
                        variant="contained"
                        color="primary"
                        onClick={handleComment}
                    >
                        Comment
                    </Button>
                </div>
            )}
        </CommentsOuterContainer>
    );
};

export default ComponentSection;