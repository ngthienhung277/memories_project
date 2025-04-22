import * as actionType from '../constants/actionTypes';

const authReducer = (state = { authData: null }, action) => {
    switch (action.type) {
        case actionType.AUTH:
            // Đảm bảo format của dữ liệu auth
            const authData = {
                result: action.data.result,
                token: action.data.token
            };

            // Kiểm tra token trước khi lưu
            if (!authData.token) {
                console.error('No token in auth data');
                return state;
            }

            // Lưu vào localStorage
            try {
                localStorage.setItem('profile', JSON.stringify(authData));
                console.log('Auth data saved successfully');
            } catch (error) {
                console.error('Failed to save auth data:', error);
                return state;
            }

            return { ...state, authData };

        case actionType.LOGOUT:
            localStorage.removeItem('profile');
            return { ...state, authData: null };

        default:
            return state;
    }
};

export default authReducer;
