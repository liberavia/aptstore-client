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
 */
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

ipcMain.on('check:app:installed', function(e, appToCheck) {
  console.log(`Check app installed called: ${JSON.stringify(appToCheck)}`);
  const fileHomePath = appToCheck.fileHomePath;
  const appId = appToCheck.appId;

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
  const returnChannel = `response:check:app:installed:${appId}`;
  console.log(`Sending respsose to '${returnChannel}': ${JSON.stringify(response)}`);
  e.reply(returnChannel, response);
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
    steam: path.join(userHome, PATH_APTSTORE_REPORT_PROGRESS, 'steam')
  };
  console.log(`paths: ${JSON.stringify(progressReportPaths)}`);

  let files = fs.readdirSync(progressReportPaths.steam);
  console.log(`files: ${files}`);
  console.log(`type: '${typeof files}'`);
  console.log(`length: '${files.length}'`);

  if (files.length == 0) {
    console.log(`respond false to response:aptstore:progress:current`);
    e.reply(`response:aptstore:progress:current`, false);
    return;
  }

  let current = [];
  files.every((file, index, array) => { 
    console.log(`File in progress report path ${file}`);
    const filePath = path.join(progressReportPaths.steam, file);
    console.log(`Full path to file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath);
    console.log(`Content: ${fileContent}`);
    console.log(`type of Content: ${typeof fileContent}`);
    const lengthOfCurrent = current.push(`${fileContent}`);
    console.log(`lengthOfCurrent: ${lengthOfCurrent}`);
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