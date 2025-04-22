import * as actionTypes from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);

        if (!data || !data.token) {
            throw new Error('Invalid server response - no token received');
        }

        dispatch({ type: actionTypes.AUTH, data });
        navigate('/');
    } catch (error) {
        console.error('Signin failed:', error.message);
    }
};

export const signup = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);

        if (!data || !data.token) {
            throw new Error('Invalid server response - no token received');
        }

        dispatch({ type: actionTypes.AUTH, data });
        navigate('/');
    } catch (error) {
        console.error('Signup failed:', error.message);
    }
};
