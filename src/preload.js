const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    let validChannels = [
        'check:file:exists'
    ] 
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    let validChannels = [
        'response:file:exists'
    ] 
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, func)
    }
  }
})