const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

function createWindow () {
    const win = new BrowserWindow({
        width: 1280,
        height: 1024,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    // Menu.setApplicationMenu(false);
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    app.quit()
})