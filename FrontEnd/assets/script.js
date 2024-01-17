/* Variables */

/* Sélection des éléments du DOM nécessaires */
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

/* Fonction qui retourne le tableau des works */

/* Cette fonction récupère les données des travaux à partir de l'API */
async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des travaux : ", error);
        console.error()
    }
}

/* Affichage des works dans le DOM */

/* Cette fonction affiche les travaux dans le DOM */
async function displayWorks() {
    const works = await getWorks();
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
        console.error();
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

/* Appel de la fonction pour afficher les travaux */
displayWorks();

/* Appel de la fonction pour afficher les catégories */
displayCategories();

/* Appel de la fonction pour filtrer les catégories */
filterCategories();