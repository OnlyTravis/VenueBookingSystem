window.addEventListener('load', () => {
    const cancel_button = document.querySelector('.submit-cancel');
    const submit_edit = document.querySelector('.submit-edit');

    if (cancel_button) cancel_button.onclick = async () => {
        if (!confirm("Are you sure you want to cancel this booking?\n")) return;
        const reason = document.querySelector('.cancel-booking')?.reason.value;
        if (!reason || reason.length === 0) {
            alert("Please enter a reason for canceling this booking.")
            return;
        }

        const response = await fetch(window.location.href, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "cancel_booking",
                reason: reason
            }),
        });

        if (response.status === 200) {
            alert("A request for cancelation has been made.\nRedirecting to 'My Request' page.")
            window.location.href = `${window.location.origin}/my_requests`;
        } else {
            alert("An error has occured while creating the request.")
        }
    }

    if (submit_edit) submit_edit.onclick = async () => {
        if (!confirm("Are you sure you want to edit this booking?\n")) return;

        const form = document.querySelector('.edit-record-form');

        const title = form.title.value;
        const description = form.description.value;
        const room = form.room.value;
        const at = form.at.value;
        const from_time = form.from_time.value;
        const to_time = form.to_time.value;
        const reason = form.reason.value;

        if (!title || !description || !room || !at || !from_time || !to_time || !reason) {
            alert("Please fill in every blanks");
            return;
        }

        const response = await fetch(window.location.href, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "change_booking",
                data: {
                    title,
                    description,
                    room,
                    at,
                    from_time,
                    to_time,
                    reason
                },
                reason: reason,
            }),
        });

        if (response.status === 200) {
            alert("A request for editing has been made.\nRedirecting to 'My Request' page.")
            window.location.href = `${window.location.origin}/my_requests`;
        } else {
            alert("An error has occured while creating the request.")
        }
    }
})