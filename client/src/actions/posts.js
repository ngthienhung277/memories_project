import { FETCH_ALL, CREATE, UPDATE, DELETE, LIKE, START_LOADING, FETCH_POST, FETCH_BY_SEARCH, END_LOADING, COMMENT } from '../constants/actionTypes';

import * as api from '../api/index.js';

// Action Creators
export const getPost = (id) => async (dispatch) => {
    console.log('🚀 useEffect gọi getPost với id:', id);
    try {
        dispatch({ type: 'START_LOADING' });
        const { data } = await api.fetchPost(id);
        if (!data) {
            console.warn('No data returned for id:', id);
            dispatch({ type: 'FETCH_POST', payload: null });
        } else {
            console.log('Fetched post:', data);
            dispatch({ type: 'FETCH_POST', payload: data });
        }
    } catch (error) {
        console.error('Error fetching post:', error.message);
        dispatch({ type: 'FETCH_POST', payload: null }); // Đặt payload là null khi có lỗi
    } finally {
        dispatch({ type: 'END_LOADING' });
    }
};

export const getPosts = (page) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchPosts(page);
        console.log("API getPosts:", data);
        dispatch({ type: FETCH_ALL, payload: data });
    } catch (error) {
        console.error('Error fetching posts:', error);
        dispatch({ type: 'FETCH_ALL', payload: { data: [], currentPage: null, numberOfPages: null } });
    } finally {
        dispatch({ type: END_LOADING });
    }
};


export const getPostsBySearch = (searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data: { data } } = await api.fetchPostsBySearch(searchQuery);
        dispatch({ type: FETCH_BY_SEARCH, payload: { data } });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.error('Error searching posts:', error);
        dispatch({ type: END_LOADING });
    }
};

export const createPost = (post) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.createPost(post);
        dispatch({ type: CREATE, payload: data });
        dispatch({ type: END_LOADING });
        return { payload: data };
    } catch (error) {
        console.error('Error creating post:', error);
        dispatch({ type: END_LOADING });
        return { error };
    }
}

export const updatePost = (id, post) => async (dispatch) => {
    try {
        const { data } = await api.updatePost(id, post);

        dispatch({ type: UPDATE, payload: data });
    } catch (error) {
        console.error('Error updating post:', error);
    }
}

export const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.likePost(id);// Call API
        console.log('Liked post response:', data); // 👈 kiểm tra xem likes trả về có đúng không
        dispatch({ type: LIKE, payload: data }); // Send to reducer
    } catch (error) {
        console.error('Error liking post:', error);
    }
};

export const commentPost = (value, id) => async (dispatch) => {
    try {
        const { data } = await api.commentPost(value, id);// Call API
        dispatch({ type: COMMENT, payload: data }); // Send to reducer

        return data.comments;
    } catch (error) {
        console.error('Error commenting post:', error);
    }
};

export const deletePost = (id) => async (dispatch) => {
    try {
        await api.deletePost(id);

        dispatch({ type: DELETE, payload: id });
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}