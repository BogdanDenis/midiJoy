import React from 'react';
import classnames from 'classnames';

import {
  useMidi,
  useRoute,
} from '../../hooks';

import css from './midi.css';

export const Midi = () => {
  const { redirectTo, currentRoute } = useRoute();
  const { ports } = useMidi();

  const currentMidiId = parseInt(currentRoute.replaceAll('/', ''), 10);

  return (
    <div className={css.midiDevicesListContainer}>
      {ports.map(port => ((
        <div className={classnames([
          css.midiDeviceContainer,
          { [css.midiDeviceActive]: currentMidiId === port.id }
        ])}>
          <button
            className={css.midiDeviceButton}
            onClick={() => redirectTo(`/${port.id}`)}
          >
            {port.name}
          </button>
        </div>
      )))}
    </div>
  );
};
