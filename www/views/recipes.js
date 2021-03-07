const { includeHTML } = require('../../include_html');
const recipeDatabase = require('../../recipe_database');

async function htmlContent() {
    let html = '';
    html += includeHTML('layout/header');
    html += includeHTML('recipes/header');

    const recipes = await recipeDatabase.get();

    html += '<div class="row">';
    if (recipes.length === 0) {
        html += `
            <div class="col text-center">
                <lottie-player src="https://assets6.lottiefiles.com/packages/lf20_113ph673.json" background="transparent" speed="1" style="margin: auto; width: 300px; height: 300px;" loop autoplay></lottie-player>
                <p class="fs-3 fw-bolder">Vous n'avez enregistré aucune recette.</p>
                <a href="new_recipe.html" class="btn btn-outline-primary btn-lg">Ajouter une recette</a>
            </div>
        `;
    } else recipes.forEach(({ _id, name, image, compo, creationDate }) => {
        const creationDateFormatted = new Date(creationDate).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        html += `
            <div id="recipe-${_id}" class="col mb-3">
                <div class="card" style="width: 18rem;">
                    ${image.length > 0 ? `<img src="https://database-d004.restdb.io/media/${image}" class="card-img-top" alt="${image}">` : ''}
                    <div class="card-body">
                        <h5 class="card-title">${name || '[Aucun nom]'}</h5>
                        <div class="card-text">
                            ${compo.length > 0 ? `<ul>${compo.map(({ title }) => title.length > 0 ? `<li class="fst-italic">${title}</li>` : '').join('')}</ul>` : ''}
                            <p>${creationDateFormatted}</p>
                        </div>
                        <a href="print.html?_id=${_id}" target="_blank" class="btn btn-primary">Imprimer</a>
                        <div class="btn-group dropup">
                            <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="new_recipe.html?_id=${_id}">Modifier</a>
                                </li>
                                <li>
                                    <a class="dropdown-item text-danger" href="javascript:deleteRecipe('${_id}');">Supprimer</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    html += includeHTML('recipes/footer');
    html += includeHTML('modals/confirm');
    html += includeHTML('layout/footer');

    return html;
}

module.exports = { htmlContent };
