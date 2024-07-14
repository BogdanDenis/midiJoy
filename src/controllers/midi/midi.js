const { ipcMain } = require('electron')
const midi = require('@julusian/midi');

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

const initialize = () => {
  ipcMain.handle(MIDI_EVENTS.GET_PORTS, () => getMidiPorts());
};

export { initialize };
