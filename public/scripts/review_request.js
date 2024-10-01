window.onload = () => {
    document.querySelector('.confirm-request').onclick = async () => {
        if (!confirm("Are you sure you want to approve this request?")) return;

        const request_response = await fetch(`${window.location.origin}/fetch_requests?request_id=${window.location.pathname.split('/')[2]}`);
        const request = await request_response.json();

        if (request.status != 0) {
            alert("The request has already been approved or rejected by someone");
            return;
        }

        const response = await fetch(window.location.href, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "approve_request",
            }),
        });

        if (response.status === 200) {
            alert("Request has been approveed.\nRedirecting to 'Pending Requests' page.");
            window.location.href = `${window.location.origin}/pending_requests`;
        } else {
            alert("An error has occured while approving the request.\nMaybe the request has already been approved or rejected by others.");
        }
    }

    document.querySelector('.reject-request').onclick = () => {
        document.querySelector('.reject-container')?.classList.toggle('hidden');
    }

    document.querySelector('.reject-button').onclick = async () => {
        if (!confirm("Are you sure you want to reject this request?")) return;

        const reason = document.querySelector('.reject-request-form').reason.value;
        if (reason.length === 0) {
            alert("Please enter a reason for rejecting the request.")
            return;
        }

        const request_response = await fetch(`${window.location.origin}/fetch_requests?request_id=${window.location.pathname.split('/')[2]}`);
        const request = await request_response.json();

        if (request.status != 0) {
            alert("The request has already been confirmed or rejected by someone");
            return;
        }

        const response = await fetch(window.location.href, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "reject_request",
                reason: reason
            }),
        });

        if (response.status === 200) {
            alert("Request has been rejected.\nRedirecting to 'Pending Requests' page.");
            window.location.href = `${window.location.origin}/pending_requests`;
        } else {
            alert("An error has occured while canceling the request.\nMaybe the request has already been confirmed or rejected by others.");
        }
    }
}