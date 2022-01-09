const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    let validChannels = [
        'check:file:home:exists',
        'cat:file:home',
        'apstore:core:proton:install',
        'apstore:core:proton:remove',
    ] 
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    let validChannels = [
        'response:file:home:exists',
        'response:cat:file:home',
        'response:apstore:core:proton:install',
        'response:apstore:core:proton:remove',
    ] 
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, func)
    }
  }
})