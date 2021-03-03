const fetch = require('node-fetch');

const recipeDataBase = {
    get() { },
    save() { },
    delete() { },
};

(() => {
    const recipeDataBaseObject = {
        dbAddress: 'https://database-d004.restdb.io',
        apikey: process.env.API_KEY || 'f2f17bbf001df7554a770505f46bd38dcb489',
        async fetch(method = 'GET', url = '', body, contentType = 'application/json') {
            url = url || '';
            const fetchParams = {
                method,
                headers: {
                    'Cache-control': 'no-cache',
                    'x-apikey': this.apikey,
                },
            }

            if (body) {
                if (contentType) fetchParams.headers["Content-Type"] = contentType;
                fetchParams.body = body;
            }

            const res = await fetch(this.dbAddress + url, fetchParams);
            return await res.json();
        },
        async get(_id = null) {
            return await this.fetch('GET', '/rest/recipes' + (_id ? `/${_id}` : ''));
        },
        async save(recipe) {
            const { _id, name, image, compo } = recipe;
            const creationDate = new Date();

            const method = _id ? 'PUT' : 'POST';
            const url = _id ? `/rest/recipes/${_id}` : '/rest/recipes';
            const { _id: returnId } = await this.fetch(method, url, JSON.stringify({
                name,
                image,
                compo,
                creationDate,
            }));

            return returnId;
        },
        async delete(_id) {
            return await this.fetch('DELETE', `/rest/recipes/${_id}`);
        },
    };

    recipeDataBase.get = recipeDataBaseObject.get.bind(recipeDataBaseObject);
    recipeDataBase.save = recipeDataBaseObject.save.bind(recipeDataBaseObject);
    recipeDataBase.delete = recipeDataBaseObject.delete.bind(recipeDataBaseObject);
})();

module.exports = recipeDataBase;
