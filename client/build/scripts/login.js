const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message || "Login failed.");
        return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "/";
});