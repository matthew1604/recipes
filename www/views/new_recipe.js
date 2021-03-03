const { includeHTML } = require('../../include_html');
const { get } = require('../../recipe_database');

async function htmlContent({ _id }) {
    let html = '';

    
    html += includeHTML('layout/header');
    html += includeHTML('new_recipe');
    
    if (_id) {
        const recipe = await get(_id);
        html += `
            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    const recipeLoaded = ${JSON.stringify(recipe)};
                    Object.keys(recipeLoaded).forEach((key) => {
                        if (Object.prototype.hasOwnProperty.call(recipe, key)) {
                            recipe[key] = recipeLoaded[key]
                        }
                    });

                    DOMElements.saveButton.state = 'saved';
                });
            </script>
        `;
    }
    
    html += includeHTML('layout/footer');

    return html;
}

module.exports = { htmlContent };
