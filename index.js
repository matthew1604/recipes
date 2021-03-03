const app = require('express')();
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const recipeDatabase = require('./recipe_database');
const port = process.env.PORT || 3000;

app.get('/', (_, res) => res.redirect(303, 'recipes.html'));

app.get('/*.html', async (req, res) => {
    const fileName = req.params['0'];

    let htmlContent;
    try {
        htmlContent = await require(`./www/views/${fileName}.js`).htmlContent(req.query);
    } catch (e) {
        console.error(e);
        res.sendStatus(404);
        return;
    }

    res.header('Content-Type', 'text/html; charset=utf-8');
    res.send(htmlContent);
});

app.get('/css/*.css', async (req, res) => {
    const fileName = req.params['0'];
    const cssContent = (await fs.readFile(`./www/css/${fileName}.css`)).toString();
    res.header('Content-Type', 'text/css; charset=utf-8');
    res.send(cssContent);
});

app.get('/js/*.js', async (req, res) => {
    const fileName = req.params['0'];
    const jsContent = (await fs.readFile(`./www/js/${fileName}.js`)).toString();
    res.header('Content-Type', 'application/javascript; charset=utf-8');
    res.send(jsContent);
});

app.post('/save-recipe', bodyParser.json(), async (req, res) => {
    const { body: recipe } = req;
    const _id = await recipeDatabase.save(recipe);
    
    res.json({ _id });
});

app.post('/delete-recipe', bodyParser.json(), async (req, res) => {
    const { body: { _id } } = req;
    const deleteResponse = await recipeDatabase.delete(_id);
    
    res.send(deleteResponse);
});

app.get('/*', async (req, res) => {
    const { params, query, url } = req;
    console.log({ params, query, url });

    res.sendStatus(403);
});

app.listen(port, console.log.bind(null, `Listening on port ${port}`));
