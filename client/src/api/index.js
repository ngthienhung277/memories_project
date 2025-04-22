import axios from 'axios';

const API = axios.create({
    baseURL: 'https://memoriesproject-production-e125.up.railway.app',
    headers: {
        'Content-Type': 'application/json'
    }
});

const getToken = () => {
    try {
        const profile = localStorage.getItem('profile');
        if (profile) {
            const parsedProfile = JSON.parse(profile);
            return parsedProfile?.token;
        }
        return null;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

API.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token added to request:', config.headers.Authorization);
        } else {
            console.log('No token available');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('profile');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export const fetchPosts = () => API.get('/posts');
export const createPost = (newPost) => API.post('/posts', newPost);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
