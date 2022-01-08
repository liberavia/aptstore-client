const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

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

ipcMain.on('check:file:home:exists', function(e, fileHomePath) {
  const userHome = app.getPath('home');  
  const systemPath = path.join(userHome, fileHomePath);
  let response = false;
  try {
    if (fs.existsSync(systemPath)) {
      response = true;
    }
  } catch(err) {
    console.log(`Catched error ${JSON.stringify(err)}`);
  }
  e.reply('response:file:home:exists', response)
});

/**
 * Demo for nonblocking cli usage 
 */
ipcMain.on('cat:file:home', function(e, fileHomePath) {
  const userHome = app.getPath('home');  
  const systemPath = path.join(userHome, fileHomePath);
  try {
    if (fs.existsSync(systemPath)) {
      const cat = spawn('cat', [systemPath]);

      cat.stdout.on("data", data => {
          console.log(`stdout: ${data}`);
          e.reply('response:cat:file:home', stdout)
        });
      
      cat.stderr.on("data", data => {
          console.log(`stderr: ${data}`);
          e.reply('response:cat:file:home', stderr)
      });
      
      cat.on('error', (error) => {
          console.log(`error: ${error.message}`);
          e.reply('response:cat:file:home', error)
      });
      
      cat.on("close", code => {
          console.log(`child process exited with code ${code}`);
      });      
    }
  } catch(err) {
    e.reply('response:cat:file:home', err)
  }  
});
