
//  O-------------------------------O
//  | main.js é executado pelo Node |
//  O-------------------------------O

// Esse código é executado pelo Node, basicamente ele abre a página
// 'index.html' em um navegador próprio (chromium) e serve como um servidor.
// Essa é a vantagem principal do Electron

const {app, BrowserWindow} = require('electron')


function createWindow() {
    win = new BrowserWindow({width: 1000, height: 800, show: false})

    win.loadFile('index.html')

    win.once('ready-to-show', () => {
        win.show()
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() } )