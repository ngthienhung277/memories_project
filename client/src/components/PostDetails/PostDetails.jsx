import React, { useEffect } from 'react'
import { Paper, Typography, CircularProgress, Divider, CardMedia } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';

import { getPost, getPostsBySearch } from '../../actions/posts';
import { CardStyled, ImageSection, LoadingPaper, RecommendedPosts, Section } from './styles';
const PostDetails = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);

  console.log('Post from redux:', post);
  console.log('all posts:', posts);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  console.log('📦 useParams id:', id);

  useEffect(() => {
    console.log('🚀 useEffect gọi getPost với id:', id); 
    dispatch(getPost(id));
  }, [id]);

  useEffect(() => {
    if (post) {
      console.log('Post loaded:', post);
      dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
    }
  }, [post, dispatch]);
  console.log("---post---", post)
  if (!post) return <Typography variant='h6'>Post not found</Typography>;

  const openPost = (_id) => navigate(`/posts/${_id}`);

  if (isLoading) {
    return (
      <LoadingPaper elevation={6}>
        <CircularProgress size="7em" />
      </LoadingPaper>
    )
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  return (  
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <CardStyled>
        <Section>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>Comments - coming soon!</strong></Typography>
          <Divider style={{ margin: '20px 0' }} />
        </Section>
        <ImageSection>
          <CardMedia src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
        </ImageSection>
      </CardStyled>
      {!!recommendedPosts.length && (
        <Section>
          <Typography gutterBottom variant="h5">You might also like:</Typography>
          <Divider />
          <RecommendedPosts>
            {recommendedPosts.map(({ title, name, message, likes, selectedFile, _id }) => (
              <div style={{ margin: '20px', cursor: 'pointer' }} onClick={() => openPost(_id)} key={_id}>
                <Typography gutterBottom variant="h6">{title}</Typography>
                <Typography gutterBottom variant="subtitle2">{name}</Typography>
                <Typography gutterBottom variant="subtitle2">{message}</Typography>
                <Typography gutterBottom variant="subtitle1">Likes: {likes.length}</Typography>
                <img src={selectedFile} alt="" width="200px" />
              </div>
            ))}
          </RecommendedPosts>
        </Section>
      )}
    </Paper>
  )
}

export default PostDetails;