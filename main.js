const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const dotenv = require('dotenv');
dotenv.config();

const PATH_APTSTORE = '.aptstore';
const PATH_APTSTORE_REPORT_PROGRESS = path.join(PATH_APTSTORE, 'reports', 'progress');

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

/**
 * Check if a certain file related to home folder exists
 * 
 * @param fileHomePath
 * @returns boolean
 */
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
 * Check if a certain app is installed. Expects a path and an id of 
 * app. Returns true or false to app channel
 * 
 * @param appToCheck
 * @returns boolean
 */
ipcMain.on('check:app:installed', function(e, appToCheck) {
  const installedDir = appToCheck.installedDir;
  const appIdent = appToCheck.appIdent;
  const fileHomePath = installedDir + `${appIdent}.json`;
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

  const returnChannel = `response:check:app:installed:${appIdent}`;
  e.reply(returnChannel, response);
});


/**
 * Feeding queue for app actions with progress reports
 * Periodically updating current progress feeded by aptstore-core reporting
 * 
 * @param void
 * @see src/store/modules/queue_app_actions
 * @see https://github.com/liberavia/aptstore-core/tree/main/aptstore_core/reporting
 * @todo add more platforms and handle merging results from different folders
 */
ipcMain.on('aptstore:progress:current', function(e) {
  const userHome = app.getPath('home');

  const progressReportPaths = {
    steam: path.join(userHome, PATH_APTSTORE_REPORT_PROGRESS, 'steam')
  };

  let files = fs.readdirSync(progressReportPaths.steam);

  if (files.length == 0) {
    e.reply(`response:aptstore:progress:current`, false);
    return;
  }

  let current = [];
  files.every((file, index, array) => { 
    const filePath = path.join(progressReportPaths.steam, file);
    const fileContent = fs.readFileSync(filePath);
    const lengthOfCurrent = current.push(`${fileContent}`);
  });

  e.reply(`response:aptstore:progress:current`, current);
});

/**
 * Process next task given. Expects nextTask object given with platform, action and ident.
 * Optional login and secret is set
 * 
 * @param nextTask
 * @returns boolean
 */
ipcMain.on('aptstore:process:next', function(e, nextTask) {
  const executable = process.env.VUE_APP_APTSTORE_CORE_EXECUTABLE;

  let params = [
    nextTask.platform, 
    nextTask.action, 
    `--ident=${nextTask.ident}`,
    '--gui'
  ];
  if (nextTask.login) {
    params.push(`--login=${nextTask.login}`);
    params.push(`--secret=${nextTask.secret}`);
  }

  const task = spawn(executable, params);

  task.on('error', (error) => {
      console.log(`error: ${error.message}`);
  });

  // Wait for progress file to popup (max 30 sec)
  const userHome = app.getPath('home');
  const reportsProgressBaseDir = '/.aptstore/reports/progress/';
  const reportsProgressFile = `${nextTask.ident}.json`;
  const progressBaseDir = '/.aptstore/progress/';
  let progressFile = `${nextTask.platform}_${nextTask.ident}.log`;
  if (nextTask.login) {
    progressFile = `${nextTask.platform}_${nextTask.ident}_${nextTask.login}.log`;
  }
  let fileToCheck = '';
  if (nextTask.action == 'install') {
    fileToCheck = path.join(
      userHome,
      reportsProgressBaseDir, 
      nextTask.platform, 
      reportsProgressFile
    );
  } else {
    fileToCheck = path.join(
      userHome,
      progressBaseDir, 
      progressFile
    );
  }

  const startTime = Date.now();

  (function(){
    let waitingForFile = true;
    let waitingForRemoval = true;
    
    function waitForRemoval() {
      if (waitingForRemoval === true) {
        const fileExists = fs.existsSync(fileToCheck);
        waitingForRemoval = fileExists;
        setTimeout(waitForRemoval, 1000);
      } else {
        // now send releasing signal after removal progress file disappeared
        e.reply(`response:aptstore:process:next`, true);
      }
    }

    function checkProgressFile() {
      if (waitingForFile === true) {
        try {
          const fileExists = fs.existsSync(fileToCheck);
          waitingForFile = !fileExists;

          if (waitingForFile) {
            // check if loop is running longer than 30 secs
            const timePassed = Date.now() - startTime;
            if (timePassed > 30000) {
              waitingForFile = false;
            }
          }
        } catch(err) {
          console.log(`Catched error ${JSON.stringify(err)}`);
        }        
        setTimeout(checkProgressFile, 1000);
      } else {
        if (nextTask.action == 'remove') {
          waitForRemoval();
        } else {
          e.reply(`response:aptstore:process:next`, true);
        }
      }
    }

    checkProgressFile();
  })();
});

