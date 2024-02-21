import getArticles from '../api';

const articles = (offset, page) => {
    return async (dispatch) => {
        const result = await getArticles(offset);
        await dispatch({ type: 'ADD_ARTICLES', payload: result });
        await dispatch({ type: 'PAGE', payload: page });
    };
};

export const article = (payload) => {
    return { type: 'ADD_ARTICLE', payload };
};

export const status = (payload) => {
    return { type: 'STATUS', payload };
};

export default articles;
