const { contextBridge, ipcRenderer } = require('electron');

const { VJOY_EVENTS } = require('../../controllers/vjoy/events');

contextBridge.exposeInMainWorld('vjoy', {
  AcquireVJD: (vjd) => ipcRenderer.invoke(VJOY_EVENTS.ACQUIRE_VJD, vjd),
  GetVJDStatus: (vjd) => ipcRenderer.invoke(VJOY_EVENTS.GET_VJD_STATUS, vjd),
  ResetVJD: (vjd) => ipcRenderer.invoke(VJOY_EVENTS.RESET_VJD, vjd),
  SetAxis: (value, vjd, axis) => ipcRenderer.invoke(VJOY_EVENTS.SET_AXIS, value, vjd, axis),
  RelinquishVJD: (vjd) => ipcRenderer.invoke(VJOY_EVENTS.RELINQUISH_VJD, vjd),
});
