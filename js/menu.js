const { shell } = require('electron')
const { Menu, MenuItem } = remote;

const template = [
    {
      label: 'File',
      submenu: [
        {
          label: "New"
        },
        {
          label: "Open"
        },
        {
          label: "Save as"
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
          click: async () => {
            
          }
        },
        { type: 'separator' },
        {
          label: 'About',
          click: async () => {
            
          }
        },
      ]
    }
  ]
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)