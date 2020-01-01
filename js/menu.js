const { shell } = require('electron')
const { Menu, MenuItem } = remote;

const template = [
    {
      label: 'File',
      submenu: [
        {
          label: "New",
          accelerator: 'Ctrl+N',
          click: () => location.reload()
        },
        {
          label: "Open",
          accelerator: 'Ctrl+O',
          click: async () => {
            let result = await dialog.showOpenDialogSync({
              properties: [
                'openFile'
              ],
              filters: [{ 
                  name: 'GD', 
                  extensions: ['gd'] 
              }]
            });

            if (result == undefined) {
              return;
            }

            OpenfilePath = result[0];
            
            return fs.readFile(OpenfilePath, (err, data) => {
              allPageFromJson(data);
              apiBroadcast("page-data-update", data);

              $("#status").text(`Open file ${OpenfilePath} at ${(new Date()).toLocaleTimeString('th-TH')}`);
            });
          }
        },
        {
          label: "Save",
          accelerator: 'Ctrl+S',
          click: async () => {
            if (typeof OpenfilePath === "undefined") {
                let result = await dialog.showSaveDialog({
                    filters: [{ 
                        name: 'GD', 
                        extensions: ['gd'] 
                    }]
                });
        
                if (result.canceled) {
                    return;
                }

                OpenfilePath = result.filePath;
            }

            let json = allPageToJson();
            apiBroadcast("page-data-update", json);
            return fs.writeFile(OpenfilePath, json, () => {
                $("#status").text(`Save file to ${OpenfilePath} at ${(new Date()).toLocaleTimeString('th-TH')}`);
            });
          }
        },
        {
          label: "Save as",
          accelerator: 'Ctrl+Shift+S',
          click: async () => {
            let result = await dialog.showSaveDialog({
                filters: [{ 
                    name: 'GD', 
                    extensions: ['gd'] 
                }]
            });
    
            if (result.canceled) {
                return;
            }

            OpenfilePath = result.filePath;

            let json = allPageToJson();
            apiBroadcast("page-data-update", json);
            return fs.writeFile(OpenfilePath, json, () => {
                $("#status").text(`Save as to ${OpenfilePath} at ${(new Date()).toLocaleTimeString('th-TH')}`);
            });
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Font',
      submenu: [
        {
          label: 'Font Manager',
          click: fontManagerOpen
        },
        {
          label: 'Add Font',
          click: fontAddOpen
        }
      ]
    },
    {
      label: 'Simulator', 
      submenu: [
        {
          label: 'Run',
          click: simulator_run
        },
        {
          label: 'Bulid',
          click: simulator_bulid
        },
        {
          label: 'Clean',
          click: simulator_clean
        },
        {
          label: 'Stop',
          click: simulator_stop
        },
        { type: 'separator' },
        {
          label: 'Bulid and Run',
          click: simulator_bulid_and_run
        },
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Documentation',
          click: () => shell.openExternal('https://docs.ioxgd.com/')
        },
        { type: 'separator' },
        {
          label: 'Join Us on Facebook',
          click: () => shell.openExternal('https://www.facebook.com/groups/ioxgd/')
        },
        {
          label: 'Report Issue',
          click: () => shell.openExternal('https://github.com/ioxgd/IOXGD-Designer/issues')
        },
        { type: 'separator' },
        {
          label: 'Check of Updates...',
          click: () => shell.openExternal('https://github.com/ioxgd/IOXGD-Designer/releases')
        },
        { type: 'separator' },
        {
          label: 'About',
          click: async () => {
            dialog.showMessageBox({
              type: "info",
              title: "About",
              message: `IOXGD Designer version ${pjson.version}`
            });
          }
        },
      ]
    }
  ]
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)