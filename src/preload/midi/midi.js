const { contextBridge, ipcRenderer } = require('electron');

const { MIDI_EVENTS } = require('../../controllers/midi/events');

contextBridge.exposeInMainWorld('midi', {
  getPorts: (callback) => {
    const subscription = (_event, value) => callback(value);

    ipcRenderer.on(MIDI_EVENTS.GET_PORTS, subscription);

    return () => ipcRenderer.removeListener(MIDI_EVENTS.GET_PORTS, subscription);
  },
  openPort: (portId) => ipcRenderer.invoke(MIDI_EVENTS.OPEN_PORT, portId),
  closePort: () => ipcRenderer.invoke(MIDI_EVENTS.CLOSE_PORT),
  onMIDIMessage: (callback) => {
    const subscription = (_event, value) => callback(value);
    
    ipcRenderer.on(MIDI_EVENTS.MESSAGE_RECEIVED, subscription);

    return () => ipcRenderer.removeListener(MIDI_EVENTS.MESSAGE_RECEIVED, subscription);
  },
});
