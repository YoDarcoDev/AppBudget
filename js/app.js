const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

const reduceBtn = document.getElementById('reduceBtn');
const sizeBtn = document.getElementById('sizeBtn');
const closeBtn = document.getElementById('closeBtn');


// GESTION DES BOUTONS DE LA FENÊTRE
reduceBtn.addEventListener('click', () => {
    ipc.send("reduceApp")
});

sizeBtn.addEventListener('click', () => {
    ipc.send("sizeApp")
});

closeBtn.addEventListener('click', () => {
    ipc.send("closeApp")
});


// GESTION AJOUT NOUVELLE LIGNE + PREPA BDD
const btnAddLigne = document.getElementById("btnSaveLigne");

// Vérifie si ca existe car on utilise un script partagé et ca ne fonctionnera que sur la page livre.html
if (btnAddLigne !== null) {
    btnAddLigne.addEventListener('click', () => {
        // Inputs formulaire
        const dateVal = document.getElementById("dateLigne");
        const montantVal = document.getElementById("montantLigne");
        const infoVal = document.getElementById("infoLigne");

        // Préparer l'objet pour insertion en BDD
        let objet = {
            date: dateVal.value,
            montant: montantVal.value,
            info: infoVal.value
        }

        // Demande au fichier main d'insérer cela en BDD
        // On lui transmet en même temps notre objet
        ipc.send('addLigneToDb', objet);
    })
}

