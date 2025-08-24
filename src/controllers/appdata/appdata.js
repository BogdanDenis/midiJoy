const fs = require('fs');
const path = require('path');

let appData = null;

class AppData {
  constructor() {
    this.dataPath = path.join(process.env.APPDATA, "\\midiJoy\\data.dat");
    this.valuesState = {};
    this.createDataFileIfNotExists();
  }

  updateState(key, value) {
    this.valuesState[key] = value;
  }

  getState(key) {
    return this.valuesState[key];
  }

  createDataFileIfNotExists = () => {
    if (fs.existsSync(this.dataPath)) {
      return;
    }

    this.saveData({ mappings: []});
  }

  encodeData = (data) => {
    return JSON.stringify(data);
  }

  decodeData = (dataString) => {
    return JSON.parse(dataString);
  }

  saveData = (data) => {
    fs.writeFile(this.dataPath, this.encodeData(data), { flag: 'w' } , (err) => {
      // throws an error, you could also catch it here
      if (err) {
        throw err;
      }
    });
  }

  readData = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(this.dataPath, (err, data) => {
        if (err) {
          throw err;
        }

        resolve(this.decodeData(data.toString()));
      });
    });
  }
}

const initialize = () => {
  if (!appData) {
    appData = new AppData();
  }

  return appData;
};

export { initialize };
