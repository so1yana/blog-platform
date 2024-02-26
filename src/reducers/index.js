const initalState = {
    amount: 5,
    page: 1,
    status: 'ready',
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
    image: null,
};

// eslint-disable-next-line default-param-last
const reducer = (state = initalState, action) => {
    switch (action.type) {
        case 'AMOUNT':
            return { ...state, amount: action.payload };
        case 'ADD_ARTICLE':
            return { ...state, article: action.payload };
        case 'STATUS':
            return { ...state, status: action.payload };
        case 'PAGE':
            return { ...state, page: action.payload };
        case 'TOKEN':
            return { ...state, userData: { ...state.userData, token: action.payload } };
        case 'CLEAR_TOKEN':
            return { ...state, userData: { ...defUserData, token: null } };
        case 'SET_USER':
            return {
                ...state,
                userData: { ...state.userData, ...(action.payload?.user || defUserData) },
            };
        default:
            return state;
    }
};

export default reducer;
