const getArticles = async (offset = 0, token = null) => {
    let options = { headers: { Authorization: `Token ${token}` } };
    if (!token) options = null;
    const result = await fetch(
        `https://blog.kata.academy/api/articles?limit=5&offset=${offset}`,
        options,
    )
        .then(async (response) => {
            if (response.status !== 200) {
                const text = await response.text();
                throw new Error(text);
            }
            return response.json();
        })
        .catch((err) => err.message);
    return result;
};

// eslint-disable-next-line default-param-last
export const getArticle = async (slug, token = null) => {
    const options = { headers: { Authorization: `Token ${token}` } };
    if (!token) options.headers = null;
    const result = await fetch(`https://blog.kata.academy/api/articles/${slug}`, options)
        .then((response) => {
            if (response.status !== 200) {
                const text = response.text();
                throw new Error(text);
            }
            return response.json();
        })
        .catch((err) => err.message);
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
    })
        .then(async (response) => {
            if (response.status !== 200) {
                const text = await response.text();
                throw new Error(text);
            }
            return response.json();
        })
        .catch((err) => err.message);

    return result;
};

export const createArticle = async (token, body) => {
    const result = await fetch('https://blog.kata.academy/api/articles', {
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then(async (response) => {
            if (response.status !== 200) {
                const text = await response.text();
                throw new Error(text);
            }
            return response.json();
        })
        .catch((err) => err.message);

    return result;
};

export const updateArticle = async (token, body, slug) => {
    const result = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
        method: 'PUT',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then(async (response) => {
            if (response.status !== 200) {
                const text = await response.text();
                throw new Error(text);
            }
            return response.json();
        })
        .catch((err) => err.message);

    return result;
};

export const deleteArticle = async (token, slug) => {
    const result = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then(async (response) => {
            if (response.status !== 200) {
                const text = await response.text();
                throw new Error(text);
            }
            return response.json();
        })
        .catch((err) => err.message);
    return result;
};

export const likeArticle = async (token, slug, isLike) => {
    let method = 'POST';
    if (!isLike) method = 'DELETE';
    const result = await fetch(`https://blog.kata.academy/api/articles/${slug}/favorite`, {
        method,
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then(async (response) => {
            if (response.status !== 200) {
                const text = await response.text();
                throw new Error(text);
            }
            return response.json();
        })
        .catch((err) => err.message);
    return result;
};

export default getArticles;
