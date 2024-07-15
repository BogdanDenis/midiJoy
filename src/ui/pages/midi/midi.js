import React from 'react';

import {
  useMidi,
  useRoute,
} from '../../hooks';

export const Midi = () => {
  const { redirectTo } = useRoute();
  const { ports } = useMidi();

  return (
    <>
      {ports.map(port => ((
        <button onClick={() => redirectTo(`/${port.id}`)}>Link to {port.name}</button>
      )))}
    </>
  );
};
