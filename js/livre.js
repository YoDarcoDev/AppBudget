
// Attend que le JS soit chargé pour appeler loadTablesLines()
$(() => {

    let mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre","Novembre", "Décembre"];

    // Afficher Date en cours
    let selectedDate = new Date();
    let dateShowed = document.getElementById("dateShowed");
    dateShowed.innerHTML = mois[selectedDate.getMonth()] + " " + selectedDate.getFullYear();


    // Gestion des boutons previous et next
    let prevMonth = document.getElementById("prevMonth");
    let nextMonth = document.getElementById("nextMonth");

    prevMonth.addEventListener('click', () => {
        selectedDate = new Date(selectedDate.setMonth(selectedDate.getMonth() - 1))
        dateShowed.innerHTML = mois[selectedDate.getMonth()] + " " + selectedDate.getFullYear();
        loadTableLines(selectedDate);
    })

    nextMonth.addEventListener('click', () => {
        selectedDate = new Date(selectedDate.setMonth(selectedDate.getMonth() + 1))
        dateShowed.innerHTML = mois[selectedDate.getMonth()] + " " + selectedDate.getFullYear();
        loadTableLines(selectedDate);
    })

    loadTableLines(selectedDate);
})

loadTableLines = function (date) {

    let mois = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    let minDate = date.getFullYear() + "-" + mois[date.getMonth()] + "-01"; // 2021-09-01
    let maxDate = date.getFullYear() + "-" + mois[date.getMonth()] + "-31"; // 2021-09-31

    // Charger la BDD
    let Datastore = require('nedb');
    let db = new Datastore({filename: 'data.db', autoload: true});

    // Récupérer tout le contenu de la BDD
    // db.find({})

    // Filtre par date (mois sélectionné)
    db.find({ $and: [{ date: { $gte: minDate }}, { date: { $lte: maxDate }}] }, function (err, docs) {
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


