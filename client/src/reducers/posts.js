
import { FETCH_ALL, FETCH_BY_SEARCH, FETCH_POST, CREATE, UPDATE, DELETE, LIKE, COMMENT, LOGOUT, CLEAR_POSTS } from '../constants/actionTypes';

const initialState = {
    posts: [],
    post: null,
    isLoading: true,
    error: null,
    currentPage: 1,
    numberOfPages: 1,
};

const postsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'START_LOADING':
            return { ...state, isLoading: true };
        case 'END_LOADING':
            return { ...state, isLoading: false };
        case FETCH_ALL:
            return {
                ...state,
                posts: action.payload.data || [],
                currentPage: action.payload.currentPage || 1,
                numberOfPages: action.payload.numberOfPages || 1,
                isLoading: false,
            };
        case FETCH_BY_SEARCH:
            return { ...state, posts: action.payload.data };
        case FETCH_POST:
            return { ...state, post: action.payload };
        case CREATE:
            return { ...state, posts: [...state.posts, action.payload] };
        case UPDATE:
        case LIKE:
            return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };
        case COMMENT:
            return {
                ...state,
                posts: state.posts.map((post) => {
                    if (post._id === +action.payload._id) {
                        return action.payload;
                    }
                    return post;
                })
            }
        case DELETE:
            return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
        case LOGOUT:
            return { posts: [], post: null, isLoading: false };
        case CLEAR_POSTS:
            return { ...state, posts: [], post: null };
        default:
            return state;
    }
};

export default postsReducer;