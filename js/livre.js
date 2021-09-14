
// Attend que le JS soit chargé pour appeler loadTablesLines()
$(() => {

    let mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre","Novembre", "Décembre"];

    // Date en cours
    let selectedDate = new Date();

    loadTableLines();
})

loadTableLines = function () {

    // Charger la BDD
    let Datastore = require('nedb');
    let db = new Datastore({filename: 'data.db', autoload: true});

    // Récupérer tout le contenu de la BDD
    db.find({}, function (err, docs) {
        let tableRegistre = document.getElementById("tableRegistre");
        let tableRows = tableRegistre.querySelectorAll("thead > tr ");

        // Vider le tableau
        tableRows.forEach((element, index) => {
            if (index > 0) {
                element.parentNode.removeChild(element);
            }
        });

        // Reconstruire le tableau à jour
        docs.forEach((element) => {

            // Création d'une ligne
            let row = tableRegistre.insertRow(1);

            // Création des cellules
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);

            // Injecter le contenu des cellules
            cell1.innerHTML = element.date;
            cell2.innerHTML = element.montant;
            cell3.innerHTML = element.info;
            cell4.innerHTML = '<button id="' + element._id + '" class="btn btn-danger"><i class="fas fa-trash"></i></button>';

            // Gestion du bouton action suppression
            let btn = document.getElementById(element._id);
            btn.addEventListener('click', () => {
                // Supprimer de la BDD
                db.remove({_id: element._id}, function (err, nbRemoved) {
                    if (err != null) {
                        console.log("Erreur : ", err);
                    }
                    console.log("Lignes supprimées : ", nbRemoved);
                    ipc.send('reload');
                });
            })
        });
    });
}


