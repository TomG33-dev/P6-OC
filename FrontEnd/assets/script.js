/* Variables */

/* Sélection des éléments du DOM nécessaires */
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

const loginLink = document.querySelector("#login-link");
const logoutLink = document.querySelector("#logout-link");
const topBar = document.querySelector(".top-bar");
const header = document.querySelector("header");
const editSpan = document.querySelector("#portfolio span");

const modal = document.querySelector("#works-modal");
const closeModalIcon = document.querySelector(".modal-content i");
const listWorksModal = document.querySelector(".listworks-modal");
let works = []

/* Fonction qui retourne le tableau des works */

/* Cette fonction récupère les données des travaux à partir de l'API */
async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des travaux : ", error);
    }
}

/* Affichage des works dans le DOM */

/* Cette fonction affiche les travaux dans le DOM */
async function displayWorks() {
    works = await getWorks();
    works.forEach((work) => {
        listOfWorks(work);
    })
}

/* Cette fonction crée et ajoute un élément pour chaque travail dans le DOM */
function listOfWorks(work) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = work.imageUrl;
    figcaption.textContent = work.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

/* Fonction qui retourne le tableau des categories */

/* Cette fonction récupère les données des catégories à partir de l'API */
async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories : ", error);
    }
}

/* Cette fonction affiche les catégories dans le DOM */
async function displayCategories() {
    const arrayOfCategories = await getCategories();
    arrayOfCategories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.id = category.id;
        filters.appendChild(btn);
    });
}

/* Cette fonction filtre les travaux en fonction de la catégorie sélectionnée */
async function filterCategories() {
    const works = await getWorks();
    const buttons = document.querySelectorAll(".filters button");
    buttons.forEach(button => {
        button.addEventListener("click", (e) => {
            const btnId = e.target.id;
            gallery.textContent = "";
            works
                .filter(work => btnId ? work.categoryId == btnId :true)
                .forEach(work => {listOfWorks(work)});
            setTimeout(() => {
                document.querySelectorAll('.gallery figure').forEach(el => el.classList.add('show'));
            }, 100);

            buttons.forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
        });
    });
}

/* Vérifie si l'utilisateur est connecté lors du chargement de la page */
function isLoggedIn() {
    return localStorage.getItem("token")
}

function initUI() {

    topBar.style.display = "none"; /* Cachez la barre supérieure par défaut */

    if (isLoggedIn()) { /* Si le token est présent dans le localStorage */
        loginLink.style.display = "none";
        logoutLink.style.display = "block";
        topBar.style.display = "block";
        editSpan.style.display = "inline";
        header.classList.add("connected");

        editSpan.addEventListener("click", openModal)
        logoutLink.addEventListener("click", logout)

        window.addEventListener("click", function(event) {
            if (event.target == modal || event.target == closeModalIcon) {
                closeModal()
            }
        });

    } else {
        loginLink.style.display = "block";
        logoutLink.style.display = "none";
    }
}

/* Gère la déconnexion de l'utilisateur */
function logout(e) {
    localStorage.removeItem("token"); /* Supprime le token du localStorage */
    location.reload()
}

function openModal() {
    displayWorksModal()
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

async function displayWorksModal() {
    listWorksModal.innerHTML = "";
    works.forEach(work => {
        const figure = document.createElement("figure")
        const img = document.createElement("img")
        const span = document.createElement("span")
        const trash = document.createElement("i")
        trash.classList.add("fas", "fa-trash-can")
        trash.id = work.id
        img.src = work.imageUrl
        span.appendChild(trash)
        figure.appendChild(img)
        figure.appendChild(span)
        listWorksModal.appendChild(figure)
    })
    deleteWorks()
}

function deleteWorks() {
    const trashAll = document.querySelectorAll(".fa-trash-can")
    trashAll.forEach(trash => {
        trash.addEventListener("click", (e) => {
            const {id} = trash
            const token = localStorage.getItem("token");
            console.log(localStorage.getItem("token"))
            const init = {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }
            fetch("http://localhost:5678/api/works/" + id, init)
            .then((response) => {
                if (!response.ok) {
                    console.log("Erreur lors de la suppression de l'image")
                }
                displayWorks().then(() => {
                    displayWorksModal()
                })
            })
        })
    })
}

document.addEventListener("DOMContentLoaded", initUI);

/* Appel de la fonction pour afficher les travaux */
displayWorks();

/* Appel de la fonction pour afficher les catégories */
displayCategories();

/* Appel de la fonction pour filtrer les catégories */
filterCategories();