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
        } else {
            info[i].classList.remove('hidden')
            hides[i].textContent = 'Esconder'
        }
    })
}

function return_index() {
    window.location.href = '/'
}