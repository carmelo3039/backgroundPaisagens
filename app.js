const body = document.body
const slider = document.getElementById('slider')
const slides = [...document.querySelectorAll('.slide')]
const previousButton = document.getElementById('previous')
const nextButton = document.getElementById('next')
const indicators = document.getElementById('slide-indicators')
const counter = document.getElementById('slide-counter')

if (!slider || !slides.length || !previousButton || !nextButton || !indicators || !counter) {
    throw new Error('Não foi possível inicializar a galeria: verifique a estrutura do HTML.')
}

let activeSlide = 0
let touchStartX = 0

const showSlide = (index) => {
    activeSlide = (index + slides.length) % slides.length

    slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeSlide
        slide.classList.toggle('active', isActive)
        slide.setAttribute('aria-hidden', String(!isActive))

        const indicator = indicators.children[slideIndex]
        indicator.setAttribute('aria-current', String(isActive))
    })

    const activeImage = slides[activeSlide].querySelector('img')
    body.style.setProperty('--backdrop-image', `url("${activeImage.currentSrc || activeImage.src}")`)
    counter.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`
    slider.style.setProperty('--progress', `${((activeSlide + 1) / slides.length) * 100}%`)
}

slides.forEach((slide, index) => {
    slide.setAttribute('role', 'group')
    slide.setAttribute('aria-roledescription', 'slide')
    slide.setAttribute('aria-label', `${index + 1} de ${slides.length}`)

    const indicator = document.createElement('button')
    indicator.type = 'button'
    indicator.className = 'slide-indicator'
    indicator.setAttribute('aria-label', `Ir para o slide ${index + 1}`)
    indicator.addEventListener('click', () => showSlide(index))
    indicators.append(indicator)
})

previousButton.addEventListener('click', () => showSlide(activeSlide - 1))
nextButton.addEventListener('click', () => showSlide(activeSlide + 1))

document.addEventListener('keydown', (event) => {
    const targetIsEditable = event.target instanceof Element
        && event.target.closest('input, textarea, select, [contenteditable="true"]')

    if (event.altKey || event.ctrlKey || event.metaKey || targetIsEditable) {
        return
    }

    if (event.key === 'ArrowLeft') showSlide(activeSlide - 1)
    if (event.key === 'ArrowRight') showSlide(activeSlide + 1)
})

slider.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') touchStartX = event.clientX
})

slider.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'touch') return

    const swipeDistance = event.clientX - touchStartX
    if (Math.abs(swipeDistance) > 50) {
        showSlide(activeSlide + (swipeDistance < 0 ? 1 : -1))
    }
})

slider.addEventListener('pointercancel', () => {
    touchStartX = 0
})

showSlide(activeSlide)
