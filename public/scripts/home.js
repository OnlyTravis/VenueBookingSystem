window.onload = () => {

document.querySelector(".change-password").onclick = () => {
    document.querySelector(".change-password-container")?.classList.remove("hidden");
}

document.querySelector(".confirm-change-password").onclick = async () => {
    const form = document.querySelector(".change-password-form");
    const original_pass = form.old_pass.value
    const new_pass_1 = form.new_pass_1.value
    const new_pass_2 = form.new_pass_2.value

    if (new_pass_1 != new_pass_2) {
        alert('The value in "confirm new password" is different than the value in "new password"\n Please Enter again.');
        return;
    }

    const response = await fetch(`${window.location.origin}/change_password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            data: {
                old_password: original_pass,
                new_password: new_pass_1
            },
        }),
    });
    const response_json = response.json();
}

}