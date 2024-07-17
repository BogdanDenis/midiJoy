import React from 'react';
import {
  useMappings,
  useMidi,
  useRoute,
} from '../../hooks';
import { MappingsForm } from './components/mapping/mappings-form';

import css from './config.css';

export const Config = () => {
  const { getParts } = useRoute();
  const { ports, openPort } = useMidi();
  const { mappings } = useMappings();

  const currentMidiId = parseInt(getParts()[0], 10);

  const currentMidiPort = ports.find(port => port.id === currentMidiId);

  if (!currentMidiPort) {
    return null;
  }

  return (
    <div className={css.configContainer}>
      <h2 className={css.configDeviceName}>{currentMidiPort.name}</h2>
      <button onClick={() => openPort(currentMidiPort.id)}>Open port</button>
      <MappingsForm mappings={mappings} />
    </div>
  );
};