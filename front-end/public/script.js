const cards = document.querySelectorAll('.revenue-card.grid')
const hides = [document.querySelector('.hide_1'), document.querySelector('.hide_2'), document.querySelector('.hide_3')]
const info = [document.querySelector('#tohide_1'), document.querySelector('#tohide_2'), document.querySelector('#tohide_3')]
let IngredineteOrPreparation = ''
for (let card of cards) {
    card.addEventListener('click', () => {
        const Id = card.getAttribute('id')
        window.location.href = `/recipe/${Id}`
    })
}

for (let i = 0; i < hides.length; i++) {
    if (hides[i]) {
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
}

function return_index() {
    window.location.href = '/'
}

/* Function add new preparation and ingredient */

const addIgredient = document.querySelector(".add-ingredient")
if (addIgredient)
    addIgredient.addEventListener('click', function() { addIngredient("ingredient") })

const addPreparation = document.querySelector(".add-preparation")
if (addPreparation)
    addPreparation.addEventListener('click', function() { addIngredient("preparation") })

function addIngredient(item) {
    console.log(item)

    const ingredients = document.querySelector(`.${item}`);
    const fieldContainer = document.querySelectorAll(`#${item}`);

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
    //if (newField.value == "") return false;

    // Deixa o valor do input vazio
    //newField.value = "";
    newField.children[0].value = "";
    ingredients.appendChild(newField);

    /*
        IngredineteOrPreparation = document.querySelectorAll("#ingredient #delete-item")
        console.log("IngredineteOrPreparation = ")
        console.log(IngredineteOrPreparation)
        if (IngredineteOrPreparation) {
            for (let deleteItem of IngredineteOrPreparation) {
                console.log("deleteItem = ")
                console.log(deleteItem)
                deleteItem.addEventListener('click', function() { removeChild(deleteItem) })
            }
        }*/
}

/* Delete Ingrediente or Preparation*/



/*
function removeChild(child) {

    const parentClose = child.parentNode
    console.log("parentClose = ")
    console.log(parentClose)
    const parentDiv = parentClose.parentNode
    console.log("parentDiv = ")
    console.log(parentDiv)
    parentDiv.remove()
        /*
        if (!parentDiv)
            return
        const index = Array.prototype.indexOf.call(parentDiv.children, parentClose)
        if (parentDiv.childElementCount > 1)
            parentDiv.removeChild(parentDiv.childNodes[index])
}*/