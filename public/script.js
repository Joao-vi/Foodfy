const currentPage = location.pathname
const cards = document.querySelectorAll('.revenue-card.grid')
const cardsChefs = document.querySelectorAll('.revenue-card.general_chef')

const hides = [document.querySelector('.hide_1'), document.querySelector('.hide_2'), document.querySelector('.hide_3')]
const info = [document.querySelector('#tohide_1'), document.querySelector('#tohide_2'), document.querySelector('#tohide_3')]
let IngredineteOrPreparation = ''
for (let card of cards) {
    card.addEventListener('click', () => {
        const Id = card.getAttribute('id')
        window.location.href = `/recipes/${Id}`
    })
}
for (let card of cardsChefs) {
    card.addEventListener('click', () => {
        const Id = card.getAttribute('id')
        window.location.href = `/chefs/${Id}`
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



/*----- Alert delete chef -----*/
const formDelete = document.querySelector("#form-delete-chef")
if (formDelete) {
    formDelete.addEventListener("submit", function(event) {
        const total = formDelete.dataset.total_recipes
        if (total != '0') {
            alert("Atenção! Chefs com recitas não podem ser deletados!")
            event.preventDefault()
        }

    })
}

/*---- Paginação -----*/
function paginate(selected_page, total_pages) {

    let pages = [],
        old_page

    for (let current_page = 1; current_page <= total_pages; current_page++) {
        const first_last_page = current_page == 1 || current_page == total_pages
        const before_pages = current_page >= selected_page - 2
        const after_pages = current_page <= selected_page + 2

        if (first_last_page || before_pages && after_pages) {

            if (old_page && current_page - old_page > 2) {
                pages.push('...')
            }
            if (old_page && current_page - old_page == 2) {
                pages.push(current_page - 1)
            }
            pages.push(current_page)
            old_page = current_page
        }
    }
    return pages
}

function create_pagination(pagination) {

    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)
    let elements = ``

    for (let page of pages) {
        if (String(page).includes('...')) {
            elements += `<span>${page}</span>`
        } else {
            console.log(filter)
            if (filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }
    pagination.innerHTML = elements
}

const pagination = document.querySelector('.pagination')
if (pagination)
    create_pagination(pagination)

/*----- header black -----*/

const _header = document.querySelector(".header")
const logo = document.querySelector(".header img")
const Header = _header.parentNode

if (currentPage.includes("admin")) {
    Header.classList.add("admin")
    logo.src = "/assets/white-logo.png"
}

const UploadPhoto = {
    name_field: document.querySelector('.input-layout p'),
    input: "",
    preview: document.querySelector('#photos-recipe-preview'),
    uploadLimit: 5,
    files: [],
    AvatarChef(event) {
        const { files: fileList } = event.target
        const div = UploadPhoto.name_field.parentNode
        console.log(div)
        UploadPhoto.name_field.innerHTML = fileList[0].name
        div.style.display = "flex"
    },
    handleFileInput(event) {
        const { files: fileList } = event.target
        UploadPhoto.input = event.target

        if (UploadPhoto.hasLimit(event))
            return
        Array.from(fileList).forEach(file => {

            UploadPhoto.files.push(file)
            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const container = UploadPhoto.getContainer(image)

                UploadPhoto.preview.appendChild(container)
            }
            reader.readAsDataURL(file)
        })
        UploadPhoto.input.files = UploadPhoto.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = UploadPhoto
        const { files: fileList } = input


        const photosContainer = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == 'photo')
                photosContainer.push(item)
        })

        const totalPhotos = fileList.length + photosContainer.length
        const qtdPhotos = uploadLimit - photosContainer.length
        if (qtdPhotos == 0) {
            alert('Você atingiu o limite máximo de fotos')
            event.preventDefault()
            return true
        } else if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        } else if (totalPhotos > uploadLimit) {
            alert(`Você só pode adicionar mais ${qtdPhotos} foto(s)`)
            event.preventDefault()
            return true
        }
        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

        UploadPhoto.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const container = document.createElement('div')

        container.classList.add('photo')

        container.onclick = UploadPhoto.removePhoto

        container.appendChild(image)

        container.appendChild(this.getRemoveButton())
        return container
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(UploadPhoto.preview.children)
        const index = photosArray.indexOf(photoDiv)


        UploadPhoto.files.splice(index, 1)
        UploadPhoto.input.files = UploadPhoto.getAllFiles()



        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoContainer = event.target.parentNode

        if (photoContainer.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            console.log("========================================================")
            console.log(removedFiles)
            console.log("========================================================")
            if (removedFiles) {
                removedFiles.value += `${photoContainer.id},`
            }
        }

        photoContainer.remove()
    }
}

const ImageGallery = {
    featured: document.querySelector('.recipe-banner > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(event) {
        const { target } = event
        ImageGallery.previews.forEach(preview => { preview.classList.remove('active') })

        target.classList.add('active')

        ImageGallery.featured.src = target.src

    }
}