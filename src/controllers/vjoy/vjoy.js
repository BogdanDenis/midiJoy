const { ipcMain } = require('electron')
import { DataType, open, define } from 'ffi-rs';

import { VJOY_EVENTS } from './events';

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

const initialize = () => {
  ipcMain.handle(VJOY_EVENTS.ACQUIRE_VJD, (event, vjd) => vJoy.AcquireVJD([vjd]));
  ipcMain.handle(VJOY_EVENTS.GET_VJD_STATUS, (event, vjd) => vJoy.GetVJDStatus([vjd]));
  ipcMain.handle(VJOY_EVENTS.RESET_VJD, (event, vjd) => vJoy.ResetVJD([vjd]));
  ipcMain.handle(VJOY_EVENTS.SET_AXIS, (event, value, vjd, axis) => vJoy.SetAxis([value, vjd, axis]));
  ipcMain.handle(VJOY_EVENTS.RELINQUISH_VJD, (event, vjd) => vJoy.RELINQUISH_VJD([vjd]));
};

export { initialize };
