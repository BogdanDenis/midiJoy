import React from 'react';
import classnames from 'classnames';

import {
  useMidi,
  useRoute,
} from '../../hooks';
import { Button } from '../../components';

import css from './midi.css';

export const Midi = () => {
  const { redirectTo, currentRoute } = useRoute();
  const { ports } = useMidi();

  const currentMidiId = parseInt(currentRoute.replaceAll('/', ''), 10);

  return (
    <div className={css.midiDevicesListContainer}>
      {ports.map(port => ((
        <Button
          isActive={currentMidiId === port.id}
          onClick={() => redirectTo(`/${port.id}`)}
        >
          {port.name}
        </Button>
      )))}
    </div>
  );
};
