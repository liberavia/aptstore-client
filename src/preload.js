const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    let validChannels = [
        'check:file:home:exists',
        'cat:file:home',
        'aptstore:progress:current',
        'aptstore:process:next',
        'check:app:installed'
    ] 
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
      ipcRenderer.on(channel, func)
  }
})