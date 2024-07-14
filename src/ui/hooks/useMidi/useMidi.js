import { useEffect, useState } from 'react';

export const useMidi = () => {
  const [ports, setPorts] = useState([]);

  useEffect(() => {
    const getPorts = async () => {
      const _ports = await window.midi.getPorts();

      setPorts(_ports);
    };

    getPorts();
  }, []);

  return {
    ports,
  };
};
