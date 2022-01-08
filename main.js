const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'src/preload.js'),
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `./dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

ipcMain.on('check:file:exists', function(e, filePath) {
  console.log(`file exists has been called with the following path: ${filePath}`);
  console.log('Faking a reply of true');
  e.reply('response:file:exists', 'my fancy value')
});
