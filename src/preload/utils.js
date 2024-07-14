const { contextBridge } = require('electron');

const getVJDs = (config) => {
  return [...new Set(config
    .reduce((acc, cur) => [...acc, cur.vjd], []))];
};

contextBridge.exposeInMainWorld('utils', {
  getVJDs
});
