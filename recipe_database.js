const fetch = require('node-fetch');

const dbAddress = 'https://database-d004.restdb.io';
const apiKey = process.env.API_KEY;

const dbFetch = async (method = 'GET', url = '', body, contentType = 'application/json') => {
    url = url || '';
    const fetchParams = {
        method,
        headers: {
            'Cache-control': 'no-cache',
            'x-apikey': apiKey,
        },
    }

    if (body) {
        if (contentType) fetchParams.headers["Content-Type"] = contentType;
        fetchParams.body = body;
    }

    const res = await fetch(dbAddress + url, fetchParams);
    return await res.json();
};

const recipeDataBase = {
    async get(_id = null) {
        return await dbFetch('GET', '/rest/recipes' + (_id ? `/${_id}` : ''));
    },
    async save(recipe) {
        const { _id, name, image, compo } = recipe;
        const creationDate = new Date();

        const method = _id ? 'PUT' : 'POST';
        const url = _id ? `/rest/recipes/${_id}` : '/rest/recipes';
        const { _id: returnId } = await dbFetch(method, url, JSON.stringify({
            name,
            image,
            compo,
            creationDate,
        }));

        return returnId;
    },
    async delete(_id) {
        const { image } = await this.get(_id);
        if (image) await dbFetch('DELETE', `/media/${image}`);

        return await dbFetch('DELETE', `/rest/recipes/${_id}`);
    },
};

module.exports = recipeDataBase;
