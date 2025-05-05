
import { FETCH_ALL, FETCH_BY_SEARCH, FETCH_POST, CREATE, UPDATE, DELETE, LIKE } from '../constants/actionTypes';

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
            console.log('Reducer FETCH_POST:', action.payload); // 👈 thêm dòng này
            return { ...state, post: action.payload };
        case CREATE:
            return { ...state, posts: [...state.posts, action.payload] };
        case UPDATE:
        case LIKE:
            return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };
        case DELETE:
            return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
        default:
            return state;
    }
};

export default postsReducer;