const cards = document.querySelectorAll('.revenue-card.grid')
const hides = [document.querySelector('.hide_1'), document.querySelector('.hide_2'), document.querySelector('.hide_3')]
const info = [document.querySelector('#tohide_1'), document.querySelector('#tohide_2'), document.querySelector('#tohide_3')]

for (let card of cards) {
    card.addEventListener('click', () => {
        const Id = card.getAttribute('id')
        window.location.href = `/recipe/${Id}`
    })
}

for (let i = 0; i < hides.length; i++) {
    hides[i].addEventListener('click', () => {
        if (!info[i].classList.contains('hidden')) {
            info[i].classList.add('hidden')
            hides[i].textContent = 'Mostrar'
            console.log("Teste testando")
        } else {
            info[i].classList.remove('hidden')
            hides[i].textContent = 'Esconder'
        }
    })
}

function return_index() {
    window.location.href = '/'
}

/* Function add new preparation and ingredient */

const addIgredient = document.querySelector(".add-ingredient")
addIgredient.addEventListener('click', function() { addIngredient("ingredient") })

const addPreparation = document.querySelector(".add-preparation")
addPreparation.addEventListener('click', function() { addIngredient("preparation") })

function addIngredient(item) {
    console.log(item)

    const ingredients = document.querySelector(`.${item}`);
    const fieldContainer = document.querySelectorAll(`#${item}`);

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
}