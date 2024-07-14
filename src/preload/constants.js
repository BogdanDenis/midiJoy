const { contextBridge } = require('electron');

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

contextBridge.exposeInMainWorld('constants', {
  axis,
  MAPPING_CONFIG,
});
