const getArticles = async (offset = 0) => {
    const result = await fetch(
        `https://blog.kata.academy/api/articles?limit=5&offset=${offset}`,
    ).then((response) => response.json());
    return result;
};

export const getArticle = async (slug) => {
    const result = await fetch(`https://blog.kata.academy/api/articles/${slug}`).then((response) =>
        response.json(),
    );
    return result;
};

export const updateUser = async (token, body) => {
    const result = await fetch('https://blog.kata.academy/api/user', {
        method: 'PUT',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then((response) => response.json());

    return result;
};

export default getArticles;
