/* Variables */

const form = document.querySelector("form");
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const loginLink = document.querySelector("#login-link");
const errorDiv = document.querySelector("#error");
const topBar = document.querySelector(".top-bar");
const header = document.querySelector("header");

/* Envoie une requête de connexion à l'API */
function loginUser(data) {
    return fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("E-mail ou mot de passe incorrect");
        }
        return response.json();
    })
    .then(data => {
        console.log("Connexion réussie :", data); /* Affiche le token dans la console */
        return data.token;
    });
}

/* Gère la soumission du formulaire */
function handleFormSubmit(e) {
    e.preventDefault();

    const data = {
        email: email.value,
        password: password.value
    };

    loginUser(data) /* Envoie une requête de connexion à l'API */
        .then(token => {
            localStorage.setItem("token", token); /* Stocke le token dans le localStorage */
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        })
        .catch(error => {
            console.error("Erreur :", error);
            errorDiv.textContent = error.message;
        });
}

/* Vérifie si l'utilisateur est connecté lors du chargement de la page */
function checkUserStatus() {
    const topBar = document.querySelector(".top-bar");
    const header = document.querySelector("header");

    if (topBar && header) {
        topBar.style.display = "none"; /* Cachez la barre supérieure par défaut */

        if (localStorage.getItem("token")) { /* Si le token est présent dans le localStorage */
            loginLink.textContent = "Logout";
            topBar.style.display = "block";
            header.classList.add("connected");
        }
    }
}

/* Gère la déconnexion de l'utilisateur */
function handleLoginLinkClick(e) {
    const topBar = document.querySelector(".top-bar");
    const header = document.querySelector("header");

    if (loginLink.textContent === "Logout") {
        e.preventDefault();
        localStorage.removeItem("token"); /* Supprime le token du localStorage */
        loginLink.textContent = "Login";
        topBar.style.display = "none";
        header.classList.remove("connected");
    }
}

document.addEventListener("DOMContentLoaded", checkUserStatus);
form.addEventListener("submit", handleFormSubmit);
loginLink.addEventListener("click", handleLoginLinkClick);