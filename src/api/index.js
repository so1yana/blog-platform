const getArticles = async (offset = 0) => {
    console.log('calling api');
    const result = await fetch(
        `https://blog.kata.academy/api/articles?limit=5&offset=${offset}`,
    ).then((response) => response.json());
    return result;
};

export const getArticle = async (slug) => {
    console.log('calling api slug');
    const result = await fetch(`https://blog.kata.academy/api/articles/${slug}`).then((response) =>
        response.json(),
    );

    return result;
};

export default getArticles;
