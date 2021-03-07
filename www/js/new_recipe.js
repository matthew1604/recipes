const recipe = {
    _id: null,
    imageId: '',
    get image() {
        return this.imageId;
    },
    set image(image) {
        if (this.imageId.length > 0 && this.imageId !== image) deleteRecipeImage(this.imageId);
        this.imageId = image;
        DOMElements.previewImg.src = image ? `https://database-d004.restdb.io/media/${image}` : '';
    },
    get name() {
        return document.querySelector('#formRecipe input[name=name]').value;
    },
    set name(name) {
        document.querySelector('#formRecipe input[name=name]').value = name;
    },
    get compo() {
        const compoContainer = document.getElementById('compo-container');

        return [...compoContainer.children].map((el) => {
            return {
                get title() {
                    return el.querySelector('input.input-title').value;
                },
                get ingredients() {
                    return [...el.querySelectorAll('li.list-group-item[contenteditable=true]')].map((item) => item.innerText.trim()).filter((val) => val);
                },
                get process() {
                    return el.querySelector('textarea').value;
                },
            };
        });
    },
    set compo(compo) {
        compo.forEach(addCompo);
    },
};

const saveRecipe = async () => {
    DOMElements.saveButton.state = 'saving';

    try {
        const { _id } = await fetch('/save-recipe', {
            method: 'POST',
            body: JSON.stringify(recipe),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json());

        recipe._id = _id;
        history.pushState(null, null, `${location.origin}${location.pathname}?_id=${_id}`);

        DOMElements.saveButton.state = 'saved';
    } catch {
        DOMElements.saveButton.state = 'not-saved';
    }
};

const postRecipeImage = async (name, blob) => {
    if (!name) return;

    const formData = new FormData();
    formData.append('image', blob, name);
    return await fetch('https://database-d004.restdb.io/media', {
        method: 'POST',
        body: formData,
        headers: {
            'x-apikey': '601154cd1346a1524ff12e9d',
        }
    }).then((res) => res.json());
}

const deleteRecipeImage = async (_id) => {
    fetch('/delete-image', {
        method: 'POST',
        body: JSON.stringify({ _id }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const addCompo = ({ title, ingredients, process } = {}) => {
    const compoTemplate = document.getElementById('compo-template');
    const compoContainer = document.getElementById('compo-container');

    const cloneTemplate = compoTemplate.content.cloneNode(true).firstElementChild;
    cloneTemplate.querySelector('button.btn-close').addEventListener('click', () => {
        cloneTemplate.remove();
        saveRecipe();
    });

    const addIngredientButton = cloneTemplate.querySelector('ul.list-group>li.list-group-item.active');
    const addIngredient = (ingredient = '') => {
        const itemClone = document.getElementById('compo-list-item').content.cloneNode(true).firstElementChild;
        itemClone.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
                e.currentTarget.blur();
                e.preventDefault();
            }
        });

        itemClone.addEventListener('paste', (e) => {
            e.preventDefault();
            const textContent = e.clipboardData.getData('text');

            const selection = getSelection();

            if (!selection.rangeCount) return false;

            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(document.createTextNode(textContent));
            selection.collapseToEnd();
        });

        itemClone.addEventListener('contextmenu', (ev) => {
            DOMElements.contextMenu.onclick = () => ev.target.remove();
            DOMElements.contextMenu.show({
                x: ev.pageX + 6,
                y: ev.pageY + 3,
            });

            ev.preventDefault();
        })

        itemClone.innerText = ingredient;

        cloneTemplate.querySelector('ul.list-group').insertBefore(itemClone, addIngredientButton);
    }

    addIngredientButton.addEventListener('click', () => addIngredient());

    if (title) cloneTemplate.querySelector('input.input-title').value = title;
    if (process) cloneTemplate.querySelector('textarea').value = process;
    if (ingredients) ingredients.forEach(addIngredient);

    compoContainer.append(cloneTemplate);
    saveRecipe();

    return cloneTemplate;
}

/**
 * listeners functions are binded with DOMElement as this
 */
const DOMElements = {
    saveButton: {
        target: document.getElementById('save-btn'),
        spinnerTarget: document.getElementById('save-btn-spinner'),
        textTarget: document.getElementById('save-btn-text'),
        states: ['not-saved', 'saving', 'saved'],
        classes: ['btn-primary', 'btn-danger', 'btn-warning'],
        set state(state) {
            if (!this.states.includes(state)) return;

            switch (state) {
                case 'not-saved':
                    this.target.classList.remove(...this.classes);
                    this.target.classList.add('btn-danger');
                    this.spinnerTarget.classList.add('d-none');
                    this.textTarget.innerText = 'Non enregistré';
                    break;
                case 'saving':
                    this.target.classList.remove(...this.classes);
                    this.target.classList.add('btn-warning');
                    this.spinnerTarget.classList.remove('d-none');
                    this.textTarget.innerText = 'Enregistrement ...';
                    break;
                case 'saved':
                    this.target.classList.remove(...this.classes);
                    this.target.classList.add('btn-primary');
                    this.spinnerTarget.classList.add('d-none');
                    this.textTarget.innerText = 'Enregistré';
                    break;
                default:
                    break;
            }
        },
        listeners: {
            click: saveRecipe,
        },
    },
    inputFile: {
        target: document.querySelector('input[type="file"][name="image"]'),
        listeners: {
            input({ currentTarget }) {
                const [file] = currentTarget.files;
                recipe.image = '';
                if (file) {
                    DOMElements.spinnerLoadingImg.show();
                    const maxFileSize = 1048576;

                    const img = new Image();
                    img.src = URL.createObjectURL(file);
                    img.onload = () => {
                        const reduceRatio = file.size > maxFileSize ? 1 - (Math.ceil(((file.size - maxFileSize) / file.size) * 100) / 100) : 1;
                        const imgRatio = img.height / img.width;

                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        canvas.width = img.width * reduceRatio;
                        canvas.height = canvas.width * imgRatio;
                        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

                        canvas.toBlob(async (blob) => {
                            const { ids: [imageId] } = await postRecipeImage(file.name, blob);
                            recipe.image = imageId;
                            DOMElements.spinnerLoadingImg.hide();
                        }, file.type);
                    }
                }

                saveRecipe();
            },
        },
    },
    spinnerLoadingImg: {
        target: document.getElementById('spinner-loading-img'),
        show() {
            this.target.classList.remove('d-none');
        },
        hide() {
            this.target.classList.add('d-none');
        },
    },
    previewImg: {
        target: document.querySelector('#preview-img>img'),
        container: document.getElementById('preview-img'),
        set src(src) {
            if (src.length > 0) {
                this.target.src = src;
                this.target.onload = () => this.container.classList.remove('d-none');
            } else this.hide();
        },
        hide() {
            this.container.classList.add('d-none');
        }
    },
    btnAddCompo: {
        target: document.getElementById('btnAddCompo'),
        listeners: {
            click: addCompo,
        },
    },
    contextMenu: {
        target: document.getElementById('context-menu-list-item'),
        set onclick(onclick) {
            this.target.onclick = onclick;
        },
        show({ x = 0, y = 0 }) {
            this.target.style.top = `${y}px`;
            this.target.style.left = `${x}px`;

            this.target.classList.remove('d-none');
        },
        hide() {
            this.target.classList.add('d-none');
        },
    },
}

// listeners
Object.keys(DOMElements).forEach((element) => {
    if (Object.prototype.hasOwnProperty.call(DOMElements[element], 'listeners')) {
        Object.keys(DOMElements[element].listeners).forEach((eventType) => {
            DOMElements[element].target.addEventListener(eventType, DOMElements[element].listeners[eventType].bind(DOMElements));
        });
    }
});

// delete ingredient in compo
document.addEventListener('click', () => DOMElements.contextMenu.hide());

// autosave
document.addEventListener('keyup', (() => {
    let timeout;

    return () => {
        DOMElements.saveButton.state = 'not-saved';
        clearTimeout(timeout);
        timeout = setTimeout(saveRecipe, 3000);
    }
})());

DOMElements.saveButton.state = 'not-saved';
