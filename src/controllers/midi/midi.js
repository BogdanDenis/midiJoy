const { ipcMain } = require('electron')
const midi = require('@julusian/midi');
const lodash = require('lodash');

const { EventBus } = require('../../eventbus');
const { MidiPort } = require('./MidiPort');
const { MIDI_EVENTS } = require('./events');

const CHECK_PORTS_INTERVAL = 500;

class MidiController {
  constructor(mainWindow) {
    this.ports = [];

    // this instance of midi.Input shouldn't open any ports. it will just serve to get list of all available ports, get their names etc.
    this._controller = new midi.Input();
    this.eventBus = EventBus.getInstance();
    this.mainWindow = mainWindow;

    // right now Midi controllers need to be connected before program startup
    // otherwise they cannot be mapped
    // it's an easy fix, but don't want to do it right now
    this.initializePorts();
    this.setIpcHandlers();
    this.keepCheckingAvailablePorts();
  }

  get existingPorts() {
    const midiPortsCount = this._controller.getPortCount();

    return new Array(midiPortsCount).fill(null)
      .map((_, index) => ({
        id: index,
        name: this._controller.getPortName(index),
      }));
  }

  get openPorts() {
    return this.ports.filter(input => input.isOpen);
  }
  
  get disconnectedPorts() {
    return this.ports.filter(port => !port.checkDeviceIsConnected(this.existingPorts));
  }

  getPortByName = (name) => {
    return this.ports.find(port => port.name === name);
  }

  getPortById = (id) => {
    return this.ports.find(port => port.getPortId() === id);
  }

  initializePorts = () => {
    this.existingPorts.forEach(({ id }) => {
      this.ports.push(this.createPort(id));
    });
  }

  setIpcHandlers = () => {
    ipcMain.handle(MIDI_EVENTS.OPEN_PORT, (_event, portId) => this.handleOpenPort(portId));
    ipcMain.handle(MIDI_EVENTS.CLOSE_PORT, (_event, portId) => this.handleClosePort(portId));
  }

  handleOpenPort = (portId) => {
    this.getPortById(portId)?.open();
  }

  handleClosePort = (portId) => {
    this.getPortById(portId)?.close();
  }

  createPort = (id) => {
    return new MidiPort(id, this.handleMIDIMessage);
  }

  handleMIDIMessage = (deltaTime, message) => {
    try {
      console.log(`MIDI message: ${message} d: ${deltaTime}`);
      const [keyType, keyId, value] = message;

      const _message = {
        keyType,
        keyId,
        value,
      };

      this.sendMessage(MIDI_EVENTS.MESSAGE_RECEIVED, _message);
      this.eventBus.emit(MIDI_EVENTS.MESSAGE_RECEIVED, null, _message);
    } catch (e) {
      console.error(e);
    }
  }

  sendMessage = (...args) => this.mainWindow.webContents.send(...args);

  // this needs to be smarter
  // we should not only detect that available ports changed
  // but also know exactly which ports had connected/disconnected
  // and update internal this.ports list
  keepCheckingAvailablePorts = () => {
    let lastExistingPorts = this.existingPorts;

    setInterval(() => {
      const difference = lodash.differenceWith(this.existingPorts, lastExistingPorts, (a, b) => a.name === b.name);

      if (difference.length) {
        this.handleAvailableMidiPortsChanged();
      }

      lastExistingPorts = this.existingPorts;

      this.sendMessage(MIDI_EVENTS.GET_PORTS, this.existingPorts);
    }, CHECK_PORTS_INTERVAL);
  }

  handleAvailableMidiPortsChanged = () => {
    if (this.disconnectedPorts.length) {
      console.log(`Disconnected ports: ${this.disconnectedPorts.map(port => port.name)}`);
  
      this.disconnectedPorts.forEach((port) => {
        if (!port.checkDeviceIsConnected(this.existingPorts)) {
          return;
        }

        try {
          // only disconnect if the port has re-connected and now has an id
          port.close();
          console.log(`Attempting to reconnect ${port.name}...`);
          port.open();
          console.log(`Port ${portName} has reconnected.`);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }
}

const initialize = (mainWindow) => {
  // keep reference to main window for if we need to re-connect ports
  const midiController = new MidiController(mainWindow)
};

export { initialize };
