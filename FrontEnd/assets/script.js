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

const addModal = document.querySelector("#add-modal");
const addModalContent = document.querySelector(".add-modal-content")
const closeAddModalIcon = addModalContent.querySelector(".add-modal-content .fa-xmark");
const backToModalIcon = addModalContent.querySelector(".add-modal-content .fa-arrow-left");

const fileInput = document.querySelector("#image");
const previewImage = document.querySelector("#addimage");
const imageContainer = document.querySelector(".add-modal-content-image");
const selectElement = document.querySelector(".add-modal-content-select");
const submitButton = document.querySelector("#submit-button");
const titleInput = document.querySelector("#title");

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
    gallery.innerHTML = "";
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
                document.querySelectorAll(".gallery figure").forEach(el => el.classList.add('show'));
            }, 100);

            buttons.forEach(btn => btn.classList.remove("selected"));
            e.target.classList.add("selected");
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

/* Modale */

/* Gère l'ouverture et la fermeture de la modale */

function openModal() {
    displayWorksModal()
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

/* Gère l'affichage des travaux dans la modale */

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

/* Gère la suppression des travaux */

function deleteWorks() {
    const trashAll = document.querySelectorAll(".fa-trash-can")
    trashAll.forEach(trash => {
        trash.addEventListener("click", (e) => {
            const {id} = trash
            const token = localStorage.getItem("token");
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
                } else {
                    console.log("L'image a bien été supprimée");
                }
                displayWorks().then(() => {
                    displayWorksModal()
                })
            })
        })
    })
}

/* Nouvelle modale */

/* Ouverture du add-modal */

document.getElementById("open-modal-button").addEventListener("click", function() {
    closeModal();
    addModal.style.display = "block";
});


/* Ajoute un écouteur d'événements pour l'événement "change" */
fileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", function(event) {
            Array.from(imageContainer.children).forEach(child => {
                child.style.display = 'none';
            });

            previewImage.src = event.target.result;
            previewImage.style.display = "block";

            imageContainer.appendChild(previewImage);

            if (titleInput.value.trim() !== "") {
                submitButton.disabled = false; // Active le bouton
            }
        });

        reader.readAsDataURL(file);
    }
});

/* Remplit l'élément select avec les catégories */

async function fillSelectWithCategories() {
    const categories = await getCategories();
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        selectElement.appendChild(option);
    });
}

/* Réinitialise la addModal */

function resetModal() {
    fileInput.value = "";
    previewImage.src = "";
    Array.from(imageContainer.children).forEach(child => {
        child.style.display = 'block';
    });
    previewImage.style.display = "none";
    selectElement.value = "";
    titleInput.value = "";
}

/* Fermeture de la addModal pendant l'ajout d'image */

closeAddModalIcon.addEventListener("click", function() {
    addModal.style.display = "none";
    resetModal();
});

backToModalIcon.addEventListener("click", function() {
    addModal.style.display = "none";
    modal.style.display = "block";
    resetModal();
});

window.addEventListener("click", function(event) {
    if (event.target == addModal) {
        addModal.style.display = "none";
        resetModal();
    }
});

/* Active ou désactive le bouton de la addModal */

titleInput.addEventListener("input", function(event) {
    if (fileInput.files.length > 0 && titleInput.value.trim() !== "") {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
});

/* Ajout d'une photo */

submitButton.addEventListener("click", addWork);

async function addWork(event) {
    event.preventDefault();

    const title = titleInput.value;
    const categoryId = selectElement.value;
    const image = fileInput.files[0];

    if (title === "" || categoryId === "" || image === undefined) {
        alert("Erreur : veuillez remplir tous les champs.");
        return;
        
    } else {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", categoryId);
            formData.append("image", image);

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.status === 201) {
                console.log("La nouvelle image a bien été ajoutée");
                displayWorks();
                closeModal();
                addModal.style.display = "none";
            }

        } catch (error) {
            console.log(error);
        }
    }
}

document.addEventListener("DOMContentLoaded", initUI);

/* Appel de la fonction pour afficher les travaux */
displayWorks();

/* Appel de la fonction pour afficher les catégories */
displayCategories();

/* Appel de la fonction pour filtrer les catégories */
filterCategories();

/* Appel de la fonction pour remplir le select avec les catégories */
fillSelectWithCategories();