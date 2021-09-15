// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var labels = ["Salaires", "Alimentation", "Factures", "Extra"];
var data = [];

// Connexion à la BDD
let Datastore1 = require('nedb');
let bdd = new Datastore1({filename: 'data.db', autoload: true});

let salaires = 0;
let alimentation = 0;
let factures = 0;
let extra = 0;

// Types de dépenses à l'année
bdd.find({}, function(err, docs) {
  docs.forEach(element => {
    if (element.type === "Salaires") {
      salaires += parseInt(element.montant);
    }
    else if (element.type === "Alimentation") {
      alimentation += parseInt(element.montant);
    }
    else if (element.type === "Factures") {
      factures += parseInt(element.montant);
    }
    else {
      extra += parseInt(element.montant);
    }
  })

  data[0] = salaires;
  data[1] = alimentation;
  data[2] = factures;
  data[3] = extra;
})


// Pie Chart Example
var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: ['#4e73df', '#1cc88a', '#c7cc36', '#bd1cc8'],
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#c7cc36', '#bd1cc8'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,
  },
});
