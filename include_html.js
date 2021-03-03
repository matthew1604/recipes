const { readFileSync } = require('fs');
const { join: pathJoin } = require('path');

function includeHTML(fileName) {
    return readFileSync(pathJoin(__dirname, `www/views/html/${fileName}.html`)).toString();
}

module.exports = { includeHTML };
