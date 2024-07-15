const { contextBridge, ipcRenderer } = require('electron');

const { MAPPINGS_EVENTS } = require('../../controllers/mappings/events');

contextBridge.exposeInMainWorld('mappings', {
  getMappings: () => ipcRenderer.invoke(MAPPINGS_EVENTS.GET_MAPPINGS),
  saveMappings: (mappings) => ipcRenderer.invoke(MAPPINGS_EVENTS.SAVE_MAPPINGS, mappings),
});
