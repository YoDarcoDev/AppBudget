const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ipc = ipcMain;

// Ajout de fichier
const fs = require('fs');

// Ouvrir fichier
const { shell } = require('electron');


// CREATION DE LA FENÊTRE
function createWindow() {
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1024,
        minHeight: 640,
        closable: true,
        darkTheme: true,
        frame: false,
        icon: path.join(__dirname, './budgeting.ico'),
        webPreferences: {
            nodeIntegration: true,
            // Empêcher l'application d'avoir accès à toutes les fonctionnalités d"Electron (true)
            contextIsolation: false,
            devTools: true,
            nativeWindowOpen: true,
            // Fait le lien entre Node et notre page web
            preload: path.join(__dirname, "preload.js"),
        }
    })

    window.loadFile("index.html")

    // Ouvrir la console developer de chrome
    // window.webContents.openDevTools()

    // GESTION DES DEMANDES IPC
    // Réduire Fenêtre
    ipc.on("reduceApp", () => {
        window.minimize();
    })

    // Agrandir Fenêtre
    ipc.on("sizeApp", () => {
        if (window.isMaximized()) {
            window.restore();
        }
        else {
            window.maximize();
        }
    })

    // Fermer Fenêtre
    ipc.on("closeApp", () => {
        window.close();
    })


    // Reload la fenêtre après suppression élément tableau
    ipc.on('reload', () => {
        window.reload();
    })


    // Export Pdf
    ipc.on('exportPdf', () => {

        // Chemin d'export
        let filepath = path.join(__dirname, './export.pdf');

        // Options du PDF
        let options = {
            marginType: 1,
            pageSize: 'A4',
            printBackground: true,
            printSelectionOnly: false,
            landscape: false
        }

        // réaliser l'export et manipuler le fichier
        window.webContents.printToPDF(options).then(data => {
            fs.writeFile(filepath, data, function (err) {
                if (err) {
                    console.log(err);
                }
                else  {
                    console.log("PDF Generated Successfully");

                    // Charger le PDF dans l'application Electron
                    // window.loadURL(filepath);

                    // Ouvrir l'explorateur de fichier et nous montrer l'emplacement du fichier
                    shell.showItemInFolder(filepath);

                    // Ouvrir le PDF avec notre lecteur par défaut
                    // shell.openPath(filepath);
                }
            })
        })
    })

    // Insertion en BDD
    ipc.on("addLigneToDb", (e, data) => {
        let Datastore = require('nedb');
        let db = new Datastore({ filename: 'data.db', autoload: true });

        db.insert(data, function (err, newrec) {
            if (err != null) {
                console.log("Erreur : ", err);
            }
            console.log("Ajouté en BDD : ", newrec);

            // Recharger la fenêtre, recharger le tableau quand on aura insérer des données
            window.reload();
        })
    })
}

// Lancer application quand Electron est prêt
app.whenReady().then(() => {
    createWindow()

    // Permet d'ajouter un écouteur lorsque l'application est activée
    // Si aucune fenêtre active, on en crée une
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})


// Écouteur pour gérer la fermeture de toutes les fenêtres
app.on('window-all-closed', () => {
    // Permet de gérer le système d'exploitation de MacOs
    if (process.platform !== 'darwin') {
        app.quit()
    }
})









