/*
  Steps:
  1. Get list of MIDI devices
  2. Ask user to select MIDI device to map
  3. Ask user for vJoy virtual device id to map to (can map to several devices at the same time)
  4. Read mapping config
  5. Get vJoy device
  6. Reset vJot device values
  7. Listen to MIDI events
  8. Send events to vJoy to update device values
*/
import midi from '@julusian/midi';
import ffi from 'ffi-napi';

import * as readline from 'node:readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const getUserInput = async (prompt) => {
  return new Promise((resolve, reject) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const MAPPING_CONFIG = [
  {
    midiId: 1,
    keyType: 176,
    keyId: 21,
    vjd: 1,
    vjdKey: 'X',
  },
];

const axis = {
  'X': 0x30,
  'Y': 0x31,
  'Z': 0x32,
  'RX': 0x33,
  'RY': 0x34,
  'RZ': 0x35,
	'SL0': 0x36,
  'SL1': 0x37,
  'WHL': 0x38,
  'POV': 0x39,
};

const getVJDs = (config) => {
  return [...new Set(config
    .reduce((acc, cur) => [...acc, cur.vjd], []))];
};

const main = async () => {
  console.log('Starting...');

  const input = new midi.Input();

  const midiPortsCount = input.getPortCount();
  
  console.log('MIDI ports:')
  for (let i = 0; i < midiPortsCount; i++) {
    console.log(`${i}: ${input.getPortName(i)}`);
  }

  const midiPort = parseInt(await getUserInput('Please select MIDI port to listen to\n'), 10);

  console.log(`Opening MIDI port ${input.getPortName(midiPort)}...`);
  input.openPort(midiPort);
  console.log(`MIDI port ${input.getPortName(midiPort)} opened successfully`);

  console.log('Loading vJoy...');

  let vJoy = null;

  try {
    vJoy = ffi.Library('C:\\Program Files\\vJoy\\x64\\vJoyInterface.dll', {
      AcquireVJD: ['int', ['int']],
      GetVJDStatus: ['int', ['int']],
      ResetVJD: ['void', ['int']],
      SetAxis: ['bool', ['long', 'int', 'int']],
      RelinquishVJD: ['int', ['int']],
    });
  } catch (e) {
    console.error('Failed to load vJoy');
  }
  
  console.log('Acquiring specified vJoy devices...');

  // getVJDs(MAPPING_CONFIG).forEach((vjd) => {
  //   const success = Boolean(vJoy.AcquireVJD(vjd)) && !Boolean(vJoy.GetVJDStatus(vjd));

  //   if (success) {
  //     vJoy.ResetVJD(vjd);
  //     console.log(`vJoy device ${vjd} acquired.`);
  //   } else {
  //     console.warn(`Failed to acquire vJoy device ${vjd}.`);
  //   }
  // });

  const handleMIDIMessage = (deltaTime, message) => {
    // The message is an array of numbers corresponding to the MIDI bytes:
    //   [status, data1, data2]
    // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
    // information interpreting the messages.
    console.log(`m: ${message} d: ${deltaTime}`);
    const [keyType, keyId, value] = message;
  
    const valueLONG = (value) << 8;

    const configEntry = MAPPING_CONFIG.find(config => config.keyType === keyType && keyId === keyId);

    if (!configEntry) {
      return;
    }

    const { vjd, vjdKey } = configEntry;

    vJoy.SetAxis(valueLONG, vjd, axis[vjdKey]);
  };

  console.log('Listening to MIDI messages...');
  input.on('message', handleMIDIMessage);

  input.closePort();
  getVJDs(MAPPING_CONFIG).forEach((vjd) => vJoy.RelinquishVJD(vjd));
};
