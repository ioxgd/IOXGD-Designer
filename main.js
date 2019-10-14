const { app, BrowserWindow } = require('electron')

let win
app.on('ready', () => {
    // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      },
      show: false
    });

    win.maximize();
    win.show();
  
    // and load the index.html of the app.
    win.loadFile('index.html')

    // Emitted when the window is closed.
    win.on('closed', () => {
      win = null
    })
})
