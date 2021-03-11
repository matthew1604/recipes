function deleteRecipe(_id) {
    const confirmModal = modals.confirm;
    confirmModal.setContent({
        title: 'Supprimer',
        message: 'Êtes-vous sûr de vouloir supprimer cette recette de façon permanente ?',
        positive: {
            class: 'btn-danger',
            label: 'Supprimer',
            onClick: async () => {
                document.getElementById(`recipe-${_id}`).remove();
                
                await fetch('/delete-recipe', {
                    method: 'POST',
                    body: JSON.stringify({ _id }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                location.reload();
            },
        },
    });

    confirmModal.show();
}
