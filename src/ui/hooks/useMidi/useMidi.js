import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export const useMidi = () => {
  const [ports, setPorts] = useState([]);

  useEffect(() => {
    const getPorts = async () => {
      const _ports = await window.midi.getPorts();

      setPorts(_ports);
    };

    getPorts();
  }, []);

  const openPort = useCallback((portId) => {
    return window.midi.openPort(portId);
  }, []);

  return {
    ports,
    openPort,
    onMIDIMessage: window.midi.onMIDIMessage,
  };
};
