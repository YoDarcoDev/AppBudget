const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ipc = ipcMain;


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
    window.webContents.openDevTools()

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









