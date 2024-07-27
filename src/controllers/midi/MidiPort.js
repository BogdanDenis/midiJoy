const midi = require('@julusian/midi');

class MidiPort {
  constructor(portNumber, handleMessage) {
    this.input = new midi.Input();
    this.name = this.input.getPortName(portNumber);
    this.isOpen = false;
    this.handleMessage = handleMessage;
  }

  getPortId = () => {
    const portsNumber = this.input.getPortCount();

    for (let i = 0; i < portsNumber; i++) {
      if (this.input.getPortName(i) === this.name) {
        return i;
      }
    }
  }

  checkDeviceIsConnected = (existingPorts) => {
    return Boolean(existingPorts.find(port => port.name === this.name));
  }

  open = () => {
    // if a MIDI device has disconnected and we need to re-connect it - then we should distroy the input and re-create it
    // otherwise `message` event listener often just doesn't fire at all even if the listener had been removed
    // probably until GC has collected old input we can't get new messages, but I'm not 100% sure
    // there's still a bit of a delay until we start getting messages, but at least we get them at all.

    this.input = new midi.Input();

    const portId = this.getPortId();
    console.log(`Opening MIDI port: ${this.name}.`);
    // TODO: return values on success/fail?
    try {
      this.input.openPort(portId);
      console.log(`Opened port ${this.name}.`);
    } catch (e) {
      console.error(e);
    }

    this.input.on('message', this.handleMessage);
    this.isOpen = true;
  }

  close = () => {
    console.log(`Closing MIDI port ${this.name}.`);

    this.input.removeListener('message', this.handleMessage);
    this.input.closePort();
    this.input.destroy();
    this.isOpen = false;
  }
}

module.exports = { MidiPort };
