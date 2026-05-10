function User (email, password) {
    this.email = email;
    this.password = password;
  }

const form = document.getElementById("registerForm");

if (form) {
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const handle = document.getElementById("handle").value;

    const response = await fetch("/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password,
            first_name,
            last_name,
            handle
        })
    });


    const data = await response.json();

    if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "post.html";
});
}

export function setCurrentUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
}

export function removeCurrentUser() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

