const { ipcMain } = require('electron')
const midi = require('@julusian/midi');
const lodash = require('lodash');

const { EventBus } = require('../../eventbus');
import { MIDI_EVENTS } from './events';

let input = new midi.Input();

const getMidiPorts = () => {
  const midiPortsCount = input.getPortCount();
  
  return new Array(midiPortsCount).fill(null)
    .map((_, index) => ({
      id: index,
      name: input.getPortName(index),
    }));
};

const getPortIdByName = (name) => {
  return getMidiPorts().find(port => port.name === name)?.id;
};

const eventBus = EventBus.getInstance();
let _mainWindow = null;

const messages = [];

const openedPorts = [];
let disconnectedPortNames = [];

const handleMIDIMessage = (deltaTime, message) => {
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

  _mainWindow.webContents.send(MIDI_EVENTS.MESSAGE_RECEIVED, _message);
  eventBus.emit(MIDI_EVENTS.MESSAGE_RECEIVED, null, _message);
};

const LISTEN_TO_PORTS_DISCONNECT_INTERVAL = 500;

const listenToPortsDisconnect = () => {
  setInterval(() => {
    if (!openedPorts.length) {
      return;
    }

    const existingPorts = getMidiPorts();

    const _disconnectedPortNames = openedPorts.filter(portName => !existingPorts.find(port => port.name === portName));

    disconnectedPortNames = lodash.uniq(lodash.concat(disconnectedPortNames, _disconnectedPortNames));

    console.log(`Disconnected ports: ${disconnectedPortNames}`);

    const portsToRemoveFromDisconnectedList = [];
    if (disconnectedPortNames.length) {
      disconnectedPortNames.forEach((portName, index) => {
        console.log(`Attempting to reconnect ${portName}...`);

        const portIdToReconnect = getPortIdByName(portName);

        if (!portIdToReconnect) {
          return;
        }

        // only disconnect if the port has re-connected and now has an id
        closePort(portName);

        try {
          openPort(portIdToReconnect, _mainWindow);
          console.log(`Port ${portName} has reconnected.`);
          portsToRemoveFromDisconnectedList.push(portName);
        } catch (e) {
          console.error(e);
        }
      });

      disconnectedPortNames = lodash.pullAll(disconnectedPortNames, portsToRemoveFromDisconnectedList);
    }
  }, LISTEN_TO_PORTS_DISCONNECT_INTERVAL);
}

const openPort = (portId) => {
  // if a MIDI device has disconnected and we need to re-connect it - then we should distroy the input and re-create it
  // otherwise `message` event listener often just doesn't fire at all even if the listener had been removed
  // probably until GC has collected old input we can't get new messages, but I'm not 100% sure
  // there's still a bit of a delay until we start getting messages, but at least we get them at all.

  input = new midi.Input();
  console.log(`Opening MIDI port ${portId}: ${input.getPortName(portId)}.`);
  // TODO: return values on success/fail?
  try {
    input.openPort(portId);
    console.log(`Opened port ${input.getPortName(portId)}.`);
  } catch (e) {
    console.error(e);
  }
  openedPorts.push(input.getPortName(portId));
  input.on('message', handleMIDIMessage);
};

const closePort = (portName) => {
  console.log('Closing MIDI port.');

  const portIndex = openedPorts.findIndex(_portName => _portName === portName);

  if (portIndex === -1) {
    return;
  }

  // this needs to be re-written for when multiple MIDI ports can be opened at the same time
  openedPorts.splice(portIndex, 1);
  input.removeListener('message', handleMIDIMessage);
  input.closePort();
  input.destroy();
};

const initialize = (mainWindow) => {
  // keep reference to main window for if we need to re-connect ports
  _mainWindow = mainWindow;

  ipcMain.handle(MIDI_EVENTS.GET_PORTS, () => getMidiPorts());
  ipcMain.handle(MIDI_EVENTS.OPEN_PORT, (_event, portId) => openPort(portId));
  ipcMain.handle(MIDI_EVENTS.CLOSE_PORT, () => closePort());

  listenToPortsDisconnect();
};

export { initialize };
