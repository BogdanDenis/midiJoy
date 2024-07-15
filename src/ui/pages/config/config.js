import React from 'react';
import {
  useMappings,
  useMidi,
  useRoute,
} from '../../hooks';
import { Mapping } from './components';
import { MappingsForm } from './components/mapping/mappings-form';

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
    <div>
      <span>Current midi device: ${currentMidiPort.name}</span>
      <button onClick={() => openPort(currentMidiPort.id)}>Open port</button>
      <MappingsForm mappings={mappings} />
    </div>
  );
};