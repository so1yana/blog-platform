export const article = (payload) => {
    return { type: 'ADD_ARTICLE', payload };
};

export const status = (payload) => {
    return { type: 'STATUS', payload };
};

export const token = (payload) => {
    return { type: 'TOKEN', payload };
};

export const clearToken = () => {
    localStorage.removeItem('token');
    return { type: 'CLEAR_TOKEN' };
};

export const setUserData = (payload = {}) => {
    return { type: 'SET_USER', payload };
};

export const amount = (payload) => {
    return { type: 'AMOUNT', payload };
};
