const { get } = require('../../recipe_database');

async function htmlContent({ _id }) {
    let html = '';
    const recipe = await get(_id);

    html += `
        <!doctype html>
        <html lang="fr">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="css/bootstrap-custom.css">
            <title>${recipe.name}</title>
        </head>
        <body>
            <div class="container-fluid p-2">
                <div class="row mb-2">
                    <div class="col text-center">
                        <h3 class="text-decoration-underline">${recipe.name}</h3>
                        ${recipe.image ? `<img src="https://database-d004.restdb.io/media/${recipe.image}" class="img-fluid rounded" alt="${recipe.name}" style="max-height: 30vh;">` : ''}
                    </div>
                </div>
                ${recipe.compo.map(({ title, ingredients, process }) => (
                    `<div class="row">
                        <div class="col-12 bg-primary fw-bolder">${title}</div>
                        <div class="col-8">
                            ${ingredients.map((ingredient) => `<p class="m-0">${ingredient}</p>`).join('')}
                        </div>
                        <div class="col-4">
                            <p class="m-0" style="white-space: pre-line;">${process}</p>
                        </div>
                    </div>`
                )).join('')}
            </div>
            <script>
                window.print();
            </script>
        </body>

        </html>
    `;

    return html;
}

module.exports = { htmlContent };
