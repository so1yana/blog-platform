import { createSlice } from '@reduxjs/toolkit';

const initalState = {
    userData: {
        token: localStorage.getItem('token') || null,
        email: '',
        username: '',
        bio: '',
        image: '',
    },
};

const defUserData = {
    token: localStorage.getItem('token') || null,
    email: '',
    username: '',
    bio: '',
    image: '',
};

export const reducer = createSlice({
    name: 'reducer',
    initialState: initalState,
    reducers: {
        token: (state, action) => ({
            ...state,
            userData: { ...state.userData, token: action.payload },
        }),
        clearToken: (state) => ({ ...state, userData: { ...defUserData, token: null } }),
        setUser: (state, action) => ({
            ...state,
            userData: { ...state.userData, ...(action.payload?.user || defUserData) },
        }),
    },
});

export const { amount, addArticle, status, page, token, clearToken, setUser } = reducer.actions;

export default reducer.reducer;
