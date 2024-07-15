import { useCallback, useEffect, useState } from 'react';

export const useMappings = () => {
  const [mappings, setMappings] = useState([]);

  const fetchMappings = useCallback(async () => {
    const res = await window.mappings.getMappings();
    setMappings(res);
  }, [setMappings]);

  useEffect(() => {
    fetchMappings();
  }, []);

  const saveMappings = useCallback(async (mappings) => {
    await window.mappings.saveMappings(mappings);
    fetchMappings();
  });

  return {
    mappings,
    saveMappings: saveMappings,
  };
};
