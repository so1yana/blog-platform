const initalState = {
    articles: [],
    article: {},
    amount: 0,
    page: 1,
    status: 'ready',
};

// eslint-disable-next-line default-param-last
const reducer = (state = initalState, action) => {
    switch (action.type) {
        case 'ADD_ARTICLES':
            return {
                ...state,
                articles: action.payload.articles,
                amount: action.payload.articlesCount,
            };
        case 'ADD_ARTICLE':
            return { ...state, article: action.payload };
        case 'STATUS':
            return { ...state, status: action.payload };
        case 'PAGE':
            return { ...state, page: action.payload };
        default:
            return state;
    }
};

export default reducer;
