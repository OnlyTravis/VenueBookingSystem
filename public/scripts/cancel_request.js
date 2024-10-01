window.onload = () => {
    //cancel booking button
    const cancel_request = document.querySelector('.cancel-request');
    if (cancel_request) {
        cancel_request.onclick = async () => {
            if (!confirm("Are you sure you want to cancel this request?")) return;

            const request_response = await fetch(`${window.location.origin}/fetch_requests?request_id=${window.location.pathname.split('/')[2]}`);
            const request = await request_response.json();

            if (request.status != 0) {
                alert("You don't have permission to remove this request!\n(Maybe the request has been confirmed)");
                return;
            }

            const response = await fetch(window.location.href, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "remove_request"
                }),
            });

            if (response.status === 200) {
                alert("Request has been removed.\nRedirecting to 'My Request' page.")
                window.location.href = `${window.location.origin}/my_requests`;
            } else {
                alert("An error has occured while canceling the request.\nMaybe the request has been confirmed by a teacher.")
            }
        }
    }
}