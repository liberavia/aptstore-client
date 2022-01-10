const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const PATH_APTSTORE = '.aptstore';
const PATH_APTSTORE_REPORTS_PROGRESS = path.join(PATH_APTSTORE, 'reports', 'progress');

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

ipcMain.on('apstore:core:proton:install', function(e, params) {
  // todo: exchange dummy 
  console.log(`triggered proton install for ident ${params.ident} with login ${params.login} and secret ${params.secret}`);
  e.reply('response:apstore:core:proton:install', 'started')
  new Promise(r => setTimeout(r, 5000)).then(() => {
    e.reply(`response:apstore:core:proton:remove`, 'finished');
  });
});

ipcMain.on('apstore:core:proton:remove', function(e, params) {
  // todo: exchange dummy 
  console.log(`triggered removing proton app with ident ${params.ident} and login ${params.login} and secret ${params.secret}`);
  e.reply('response:apstore:core:proton:remove', 'started')
  new Promise(r => setTimeout(r, 5000)).then(() => {
    e.reply(`response:apstore:core:proton:remove`, 'finished');
  });
});

/**
 * Feeding queue for app actions with progress reports
 * Periodically updating current progress feeded by aptstore-core reporting
 * 
 * @see src/store/modules/queue_app_actions
 * @see https://github.com/liberavia/aptstore-core/tree/main/aptstore_core/reporting
 * @todo add more platforms and handle merging results from different folders
 */
ipcMain.on('aptstore:progress:current', function(e) {
  console.log(`triggered aptstore:progress:current`);
  const userHome = app.getPath('home');

  const progressReportPaths = {
    steam: path.join(userHome, PATH_APTSTORE_REPORTS_PROGRESS)
  };
  console.log(`paths: ${progressReportPaths}`);

  let files = fs.readdirSync(progressReportPaths.steam).filter(fn => fn.endsWith('.log'));
  console.log(`files: ${files}`);

  if (!files ) {
    console.log(`respond false to response:aptstore:progress:current`);
    e.reply(`response:aptstore:progress:current`, false);
    return;
  }

  let current = [];
  files.forEach(function(file){
    const filePath = path.join(progressReportPaths.steam, file.name);
    fs.readFileSync(filePath);
    current.push(fileContent);
  });

  console.log(`respond to response:aptstore:progress:current: ${current}`);
  e.reply(`response:aptstore:progress:current`, current);
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
