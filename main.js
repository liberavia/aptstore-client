const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const dotenv = require('dotenv');
dotenv.config();

const PATH_APTSTORE = '.aptstore';
const PATH_APTSTORE_REPORTS_PROGRESS = path.join(PATH_APTSTORE, 'reports', 'progress', 'steam');

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
  console.log(`Path to check ${systemPath}`);
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
  console.log(`paths: ${JSON.stringify(progressReportPaths)}`);

  let files = fs.readdirSync(progressReportPaths.steam).filter(fn => fn.endsWith('.log'));
  console.log(`files: ${files}`);

  if (files.length === 0) {
    console.log(`respond false to response:aptstore:progress:current`);
    e.reply(`response:aptstore:progress:current`, false);
    return;
  }

  let current = [];
  files.forEach(function(file){
    console.log(`File in progress report path ${file}`);
    const filePath = path.join(progressReportPaths.steam, file);
    const fileContent = fs.readFileSync(filePath);
    current.push(fileContent);
  });

  console.log(`respond to response:aptstore:progress:current: ${current}`);
  e.reply(`response:aptstore:progress:current`, current);
});

/**
 * Process next task given
 */
ipcMain.on('aptstore:process:next', function(e, nextTask) {
  console.log(`Calling to progress next task ${JSON.stringify(nextTask)}`);
  const executable = process.env.VUE_APP_APTSTORE_CORE_EXECUTABLE;
  console.log(`Executable is ${executable}`);
  const task = spawn(executable, [
    nextTask.platform, 
    nextTask.action, 
    `--ident=${nextTask.ident}`,
    `--login=${nextTask.login}`,
    `--secret=${nextTask.secret}`
  ]);

  task.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
  });

  task.stderr.on("data", data => {
      console.log(`stderr: ${data}`);
  });

  task.on('error', (error) => {
      console.log(`error: ${error.message}`);
  });

  task.on("close", code => {
      console.log(`child process exited with code ${code}`);
  });      

  // @todo: wait for progress file to popup. Currently just wait 5 seconds before leaving
  // and hope file has been created in the meantime
  new Promise(r => setTimeout(r, 5000)).then(() => {
    e.reply(`response:aptstore:process:next`, true);
  });
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
