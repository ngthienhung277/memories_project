import React, { useEffect, useState } from 'react';
import { Container, Button, Grow, Grid, Paper, AppBar, TextField, Chip, Autocomplete } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { getPostsBySearch, getPosts } from '../../actions/posts';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Pagination from '../Pagination';


function useQuery() {
    return new URLSearchParams(useLocation().search)
}
const Home = ({ currentId, setCurrentId }) => {
    const query = useQuery();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState('');

    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery')

    useEffect(() => {
        dispatch(getPosts());
    }, [dispatch]);

    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);



    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            //search post
            searchPost();
        }
    }

    const searchPost = () => {
        if (search.trim() || tags) {
            dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`)
            console.log("Searching for:", { search, tags });

        } else {
            navigate('/');
        }
    }

    const handleAddChip = (tag) => setTags([...tags, tag]);

    const handleDeleteChip = (chipToDelete) => setTags(tags.filter((tag) => tag !== chipToDelete));

    return (
        <Grow in>
            <Container maxWidth='xl'>
                <Grid container justifyContent="space-between" alignItems="stretch" spacing={3}>
                    <Grid size={{ xs: 12, sm: 7, md: 9 }} >
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                        <AppBar position='static' color='inherit' sx={{ borderRadius: 4, marginBottom: '1rem', display: 'flex', padding: '16px' }}>
                            <TextField
                                name='search'
                                variant='outlined'
                                label="Search Memories"
                                onKeyDown={handleKeyPress}
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Autocomplete
                                multiple
                                freeSolo
                                options={[]}
                                value={tags}
                                inputValue={inputValue}
                                onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
                                onChange={(event, newValue) => {
                                    setTags(newValue);
                                    setInputValue('');
                                }
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const trimmed = inputValue.trim();
                                        if (trimmed && !tags.includes(trimmed)) {
                                            setTags([...tags, trimmed]);
                                        }
                                        setInputValue('');
                                        // searchPost();
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search Tags"
                                        variant='outlined'
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            key={index}
                                            label={option}
                                            sx={{ m: '5px' }}
                                            {...getTagProps({ index })}
                                        />
                                    ))}
                            />
                            <Button onClick={searchPost} variant="contained" color="primary" sx={{ mt: 2 }} fullWidth >Search</Button>
                        </AppBar>
                        <Form currentId={currentId} setCurrentId={setCurrentId} />
                        {(!searchQuery && !tags.length) && (
                            <Paper sx={{ mt: 2, p: 2, borderRadius: 4 }} elevation={6}>
                                <Pagination page={page} />
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Grow >
    );
};

export default Home;
