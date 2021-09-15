$(() => {

    let date = new Date();
    let mois = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    let minDate = date.getFullYear() + "-" + mois[date.getMonth()] + "-01";
    let maxDate = date.getFullYear() + "-" + mois[date.getMonth()] + "-31";

    let Datastore = require('nedb');
    let db = new Datastore({filename: 'data.db', autoload: true});

    const revenusMois = document.getElementById("revenusMois");
    const revenusAn = document.getElementById("revenusAn");
    const depensesMois = document.getElementById("depensesMois");
    const depensesMoisStyle = document.getElementById("depensesMoisStyle");
    const depensesAn = document.getElementById("depensesAn");

    db.find({}, function (err, docs) {
        let recettesAn = 0;
        let depAn = 0;
        let recettesMois = 0;
        let depMois = 0;

        docs.forEach(element => {
            // Calcul pour l'année
            if (parseInt(element.montant) > 0) {
                recettesAn += parseInt(element.montant);
            }
            else {
                depAn += parseInt(element.montant);
            }

            // Calcul pour le mois en cours
            if (element.date >= minDate && element.date <= maxDate) {
                if (parseInt(element.montant) > 0) {
                    recettesMois += parseInt(element.montant);
                }
                else {
                    depMois += parseInt(element.montant);
                }
            }
        })

        // On affiche les depenses et les revenus de l'année
        revenusAn.innerHTML = recettesAn + " €";
        depensesAn.innerHTML = depAn + " €";
        revenusMois.innerHTML = recettesMois + " €";

        // Calcul pourcentage
        let pourcentage = (depMois * 100) / recettesMois;
        depensesMois.innerHTML = Math.trunc(pourcentage) * -1 + "%";
        depensesMoisStyle.style.width = pourcentage + '%';
    });
})