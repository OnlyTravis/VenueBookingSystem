window.onload = () => {
    const cancel_button = document.querySelector('.remove-record');
    const edit_button = document.querySelector('.edit-record');
    const cancel_edit = document.querySelector('.cancel-edit');

    if (edit_button) edit_button.onclick = () => {
        document.querySelector('.edit-container')?.classList.toggle('hidden');
    }
    if (cancel_button) cancel_button.onclick = () => {
        document.querySelector('.cancel-container')?.classList.toggle('hidden');
    }
    if (cancel_edit) cancel_edit.onclick = () => {
        document.querySelector('.edit-container')?.classList.toggle('hidden');
    }
}