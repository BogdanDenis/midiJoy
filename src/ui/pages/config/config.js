import React from 'react';
import {
  useMappings,
  useMidi,
  useRoute,
} from '../../hooks';
import { MappingsForm } from './components/Mapping/mappings-form';
import { OpenPortButton } from './components';


import css from './config.css';

export const Config = () => {
  const { getParts } = useRoute();
  const { ports } = useMidi();
  const { mappings } = useMappings();

  const currentMidiId = parseInt(getParts()[0], 10);

  const currentMidiPort = ports.find(port => port.id === currentMidiId);

  if (!currentMidiPort) {
    return null;
  }

  return (
    <div className={css.configContainer}>
      <h2 className={css.configDeviceName}>{currentMidiPort.name}</h2>
      <OpenPortButton currentMidiPort={currentMidiPort} />
      <MappingsForm mappings={mappings} />
    </div>
  );
};