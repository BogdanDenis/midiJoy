import React from 'react';

import { Config, Midi } from './pages';
import { useRoute } from './hooks';

import css from './App.css';

/*

What does user need to be able to do:
1. Select among MIDI devices which one to use. Can select multiple
2. So probably on UI there will be a list of MIDI devices
3. When user clicks on one - they will see a section with mappings for that device.
4. User clicks to add a new mapping, they will need to use mapped MIDI key, select VJD to map to, and which VJD axis to control.
5. After mapping the control user should be able to see in real time how VJD values change.
6. User should be able to edit/delete mappings.

*/

// Electron doesn't seem to work consistently with react-router-dom
// and electron-forge has some weird configs that I couldn't get to work with electron-router-dom
// so this project with have ugly state-based conditional component rendering

const App = () => {
  const { currentRoute } = useRoute();

  return (
    <div className={css.appContainer}>
      <Midi />
      {currentRoute.match(/\/.+/) && (
        <Config />
      )}
    </div>
  );
}

export default App;
