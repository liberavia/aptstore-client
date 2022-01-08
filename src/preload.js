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
  sendSync: (channel, data) => {
    let validChannels = [
        'check:file:exists'
    ] 
    if (validChannels.includes(channel)) {
      ipcRenderer.sendSync(channel, data)
    }
  },
  receive: (channel, func) => {
    let validChannels = [
        'check:file:exists'
    ] 
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})