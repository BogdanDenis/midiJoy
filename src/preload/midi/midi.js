const { contextBridge, ipcRenderer } = require('electron');

const { MIDI_EVENTS } = require('../../controllers/midi/events');

contextBridge.exposeInMainWorld('midi', {
  getPorts: () => ipcRenderer.invoke(MIDI_EVENTS.GET_PORTS),
});
