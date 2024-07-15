const { contextBridge, ipcRenderer } = require('electron');

const { MIDI_EVENTS } = require('../../controllers/midi/events');

contextBridge.exposeInMainWorld('midi', {
  getPorts: () => ipcRenderer.invoke(MIDI_EVENTS.GET_PORTS),
  openPort: (portId) => ipcRenderer.invoke(MIDI_EVENTS.OPEN_PORT, portId),
  closePort: () => ipcRenderer.invoke(MIDI_EVENTS.CLOSE_PORT),
  onMIDIMessage: (callback) => {
    const subscription = (_event, value) => callback(value);
    
    ipcRenderer.on(MIDI_EVENTS.MESSAGE_RECEIVED, subscription);

    return () => ipcRenderer.removeListener(MIDI_EVENTS.MESSAGE_RECEIVED, subscription);
  },
});
