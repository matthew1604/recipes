document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('confirm-modal');
    const modalTitle = modalElement.querySelector('.modal-title');
    const modalBody = modalElement.querySelector('.modal-body');
    const negativeButton = modalElement.querySelector('.modal-footer>.btn:nth-child(1)');
    const positiveButton = modalElement.querySelector('.modal-footer>.btn:nth-child(2)');
    
    const bootstrapModal = new bootstrap.Modal(modalElement);

    const confirmModal = {
        setContent(params = {}) {
            const {
                title = 'Confirmation',
                message = 'Êtes-vous sûr ?',
                positive: {
                    class: positiveClass = 'btn-primary',
                    label: positiveLabel = 'Confirmer',
                    onClick: positiveOnClick,
                } = { label: 'Confirmer' },
                negative: {
                    class: negativeClass = 'btn-default',
                    label: negativeLabel = 'Annuler',
                    onClick: negativeOnClick,
                } = { label: 'Annuler' },
            } = params;

            modalTitle.innerText = title;
            modalBody.innerHTML = message;

            negativeButton.classList.remove(...negativeButton.classList);
            negativeButton.classList.add('btn', ...negativeClass.split(' '));

            negativeButton.innerText = negativeLabel;
            negativeButton.onclick = () => {
                negativeOnClick && negativeOnClick();
                this.hide();
            };
            
            positiveButton.classList.remove(...positiveButton.classList);
            positiveButton.classList.add('btn', ...positiveClass.split(' '));

            positiveButton.innerText = positiveLabel;
            positiveButton.onclick = () => {
                positiveOnClick && positiveOnClick();
                this.hide();
            };
        },
        show() {
            bootstrapModal.show();
        },
        hide() {
            bootstrapModal.hide();
        },
    };

    modals.confirm = confirmModal;
});
