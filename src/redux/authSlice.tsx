import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
    token: Cookies.get('token') || null, // Inisialisasi token dari cookies
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            Cookies.set('token', action.payload, { expires: 1 }); 
        },
        removeToken: (state) => {
            state.token = null;
            Cookies.remove('token'); // Hapus token dari cookies
        },
    },
});

export const { setToken, removeToken } = authSlice.actions;
export default authSlice.reducer;
