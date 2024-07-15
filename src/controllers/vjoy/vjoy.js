import { DataType, open, define } from 'ffi-rs';

const { initialize: initializeAppData } = require('../appdata/appdata');
const { EventBus } = require('../../eventbus');
import { MIDI_EVENTS } from '../midi/events';
const { VJOY_AXIS } = require('./constants');

open({
  library: 'vJoy',
  path: 'C:\\Program Files\\vJoy\\x64\\vJoyInterface.dll',
});

const vJoy = define({
  AcquireVJD: {
    library: 'vJoy',
    retType: DataType.I32,
    paramsType: [DataType.I32],
  },
  GetVJDStatus: {
    library: 'vJoy',
    retType: DataType.I32,
    paramsType: [DataType.I32],
  },
  ResetVJD: {
    library: 'vJoy',
    retType: DataType.Void,
    paramsType: [DataType.I32],
  },
  SetAxis: {
    library: 'vJoy',
    retType: DataType.Boolean,
    paramsType: [DataType.I64, DataType.I32, DataType.I32],
  },
  RelinquishVJD: {
    library: 'vJoy',
    retType: DataType.I32,
    paramsType: [DataType.I32],
  },
});

const appData = initializeAppData();
const eventBus = EventBus.getInstance();

const getVJDs = (config) => {
  return [...new Set(config
    .reduce((acc, cur) => [...acc, cur.vjdId], []))];
};

const initialize = async () => {
  console.log('Acquiring specified vJoy devices...');

  const { mappings } = await appData.readData();

  try {
    getVJDs(mappings).forEach((vjd) => {
      const success = Boolean(vJoy.AcquireVJD([vjd])) && !Boolean(vJoy.GetVJDStatus([vjd]));

      if (success) {
        vJoy.ResetVJD([vjd]);
        console.log(`vJoy device ${vjd} acquired.`);
      } else {
        console.warn(`Failed to acquire vJoy device ${vjd}.`);
      }
    });
  } catch (e) {
    console.error(e);
  }

  eventBus.on(MIDI_EVENTS.MESSAGE_RECEIVED, (message) => {
    const { value, keyType, keyId } = message;

    const configEntry = mappings.find(config => config.keyType === keyType && config.keyId === keyId);

    if (!configEntry) {
      return;
    }

    const valueLONG = (value + 1) << 8;

    try {
      vJoy.SetAxis([valueLONG, configEntry.vjdId, VJOY_AXIS[configEntry.vjdKey]]);
    } catch (e) {
      console.error(e);
    }
  });
};

export { initialize };
