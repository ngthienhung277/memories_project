import * as actionType from '../constants/actionTypes';

const authReducer = (state = { authData: null }, action) => {
    console.log('AUTH reducer triggered with data:', action.data);

    switch (action.type) {
        case actionType.AUTH:

            // Kiểm tra action.data có tồn tại và hợp lệ không
            if (!action.data || !action.data.result || !action.data.token) {
                console.error('Invalid auth data:', action.data);
                return state; // Trả về state hiện tại nếu dữ liệu không hợp lệ
            }
            // Đảm bảo format của dữ liệu auth
            const authData = {
                result: action.data.result,
                token: action.data.token,
            };

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
            try {
                localStorage.removeItem('profile');
                console.log('Logged out, profile removed from localStorage');
            } catch (error) {
                console.error('Failed to clear localStorage:', error);
            }
            return { ...state, authData: null };

        default:
            return state;
    }
};

export default authReducer;
