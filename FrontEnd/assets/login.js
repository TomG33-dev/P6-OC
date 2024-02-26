/* Variables */

const form = document.querySelector("form");
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const errorDiv = document.querySelector(".errordiv")




/* Envoie une requête de connexion à l'API */
function loginUser(data) {
    return fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.status == 401) {
            throw new Error("E-mail ou mot de passe incorrect");
        } else if (response.status == 200) {
            return response.json();
        }
    })
    .then(data => {
        localStorage.setItem("token", data.token); /* Stocke le token dans le localStorage */
        window.location.href = "index.html";
    })
    .catch(error => {
        errorDiv.textContent = error.message;
    });
}

/* Gère la soumission du formulaire */
function handleFormSubmit(e) {
    e.preventDefault();

    const data = {
        email: email.value,
        password: password.value
    };

    loginUser(data); /* Envoie une requête de connexion à l'API */
}

form.addEventListener("submit", handleFormSubmit);