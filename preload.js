// Quand le DOM est chargé
window.addEventListener('DOMContentLoaded', () => {

    // Fonction qui permet d'ajouter du texte
    const replaceText = (selector, text) => {
        const el = document.getElementById(selector)
        if (el) {
            el.innerHTML = text
        }
    }

    // Boucle sur les types d'outils, et appel de la fonction
    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})



