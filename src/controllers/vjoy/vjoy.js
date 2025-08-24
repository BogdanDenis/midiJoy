import { DataType, open, define } from 'ffi-rs';

const { initialize: initializeAppData } = require('../appdata/appdata');
const { EventBus } = require('../../eventbus');
import { MIDI_EVENTS } from '../midi/events';
import { KEY_TYPES } from '../midi/constants';
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
  SetBtn: {
    library: 'vJoy',
    retType: DataType.Boolean,
    paramsType: [DataType.Boolean, DataType.I32, DataType.U8],
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
    .reduce((acc, cur) => [...acc, parseInt(cur.vjdId, 10)], []))];
};

const initialize = async () => {
  console.log('Acquiring specified vJoy devices...');

  const { mappings } = await appData.readData();

  try {
    getVJDs(mappings).forEach((vjd) => {
      console.log(`Processing vJoy device ${vjd}...`);
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

    let _value = null;

    if (keyType === KEY_TYPES.AXIS) {
      if (configEntry.isFineTuning) {
        const savedMidiValue = appData.getState(`${configEntry.vjdId}.${configEntry.vjdKey}`);

        const fineTuneValue = value - (128 / 2); // from [0, 127] to [-64, 64]
        _value = ((savedMidiValue) << 8) + fineTuneValue * 10;
      } else {
        _value = (value) << 8;
      }
    } else if (keyType === KEY_TYPES.BTN_PRESS) {
      _value = true; // TODO: need to store value or get from vJoy and invert it
    } else if (keyType === KEY_TYPES.BTN_RELEASE) {
      _value = false;
    }

    try {
      if (keyType === KEY_TYPES.AXIS) {
        vJoy.SetAxis([_value, configEntry.vjdId, VJOY_AXIS[configEntry.vjdKey]]);
      } else if ([KEY_TYPES.BTN_PRESS, KEY_TYPES.BTN_RELEASE].includes(keyType)) {
        vJoy.SetBtn([_value, configEntry.vjdId, configEntry.vjdKey])
      }

      // should not save midi value if we're fine-tuning.
      // Otherwise we'll be saving a midi value from a fine-tuner to a tuned value
      if (!configEntry.isFineTuning) {
        appData.updateState(`${configEntry.vjdId}.${configEntry.vjdKey}`, value);
      }
    } catch (e) {
      console.error(e);
    }
  });
};

export { initialize };
