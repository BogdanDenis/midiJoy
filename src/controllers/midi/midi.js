const { ipcMain } = require('electron')
const midi = require('@julusian/midi');

const { EventBus } = require('../../eventbus');
import { MIDI_EVENTS } from './events';

const input = new midi.Input();

const getMidiPorts = () => {
  const midiPortsCount = input.getPortCount();
  
  return new Array(midiPortsCount).fill(null)
    .map((_, index) => ({
      id: index,
      name: input.getPortName(index),
    }));
};

const eventBus = EventBus.getInstance();

const messages = [];

const handleMIDIMessage = (deltaTime, message, mainWindow) => {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  console.log(`MIDI message: ${message} d: ${deltaTime}`);
  const [keyType, keyId, value] = message;

  const _message = {
    keyType,
    keyId,
    value,
  };

  messages.push(_message);

  mainWindow.webContents.send(MIDI_EVENTS.MESSAGE_RECEIVED, _message);
  eventBus.emit(MIDI_EVENTS.MESSAGE_RECEIVED, null, _message);
};

const openPort = (portId, mainWindow) => {
  // TODO: refactor so that mainWindow is not passed directly to this function
  console.log(`Opening MIDI port ${portId}: ${input.getPortName(portId)}.`);
  // TODO: return values on success/fail?
  input.openPort(portId);
  input.on('message', (deltaTime, message) => handleMIDIMessage(deltaTime, message, mainWindow))
};

const closePort = () => {
  console.log('Closing MIDI port.');
  input.closePort();
};

const initialize = (mainWindow) => {
  ipcMain.handle(MIDI_EVENTS.GET_PORTS, () => getMidiPorts());
  ipcMain.handle(MIDI_EVENTS.OPEN_PORT, (_event, portId) => openPort(portId, mainWindow));
  ipcMain.handle(MIDI_EVENTS.CLOSE_PORT, () => closePort());
};

export { initialize };
