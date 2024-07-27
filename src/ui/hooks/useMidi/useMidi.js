import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export const useMidi = () => {
  const [ports, setPorts] = useState([]);

  useEffect(() => {
    return window.midi.getPorts((_ports) => {
      setPorts(_ports);
    });
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
