const {app, BrowserWindow, ipcMain} = require('electron')
const url = require('url');
const path = require('path');

const numberOfWindows = 50;

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 450,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
    }
  })

  return mainWindow;
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

const createManyWindows = async () => {      
  console.time('load pages');
  const createWindows = [];
  for(let i=0; i<numberOfWindows; i++){
    createWindows.push(
      new Promise(resolve => {
        const win = createWindow();
        win.loadURL(
          url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true,
            query: {
              id: i,
            },
          })
        );
        // Wait ready event
        ipcMain.once('ready-' + i, () => {
          resolve();
        });
      })
    );
  }
  await Promise.all(createWindows);
  console.timeEnd('load pages');
};

app.on('ready', createManyWindows)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
