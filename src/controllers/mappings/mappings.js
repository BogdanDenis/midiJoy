const { ipcMain } = require('electron')

const { initialize: initializeAppData } = require('../appdata/appdata');

import { MAPPINGS_EVENTS } from './events';

const appData = initializeAppData();

const getMappings = async () => {
  const data = await appData.readData();
  return data.mappings || [];
};

const saveMappings = async (mappings) => {
  // TODO: in future also check for MIDI device as support for mapping multiple MIDI devices is planned
  await appData.saveData({ mappings });
};

const initialize = () => {
  ipcMain.handle(MAPPINGS_EVENTS.GET_MAPPINGS, async () => getMappings());
  ipcMain.handle(MAPPINGS_EVENTS.SAVE_MAPPINGS, (_event, mappings) => saveMappings(mappings));
};

export { initialize };
