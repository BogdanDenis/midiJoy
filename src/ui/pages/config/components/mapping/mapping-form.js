import React, {
  useCallback,
  useState,
} from 'react';

import {
  useMappings,
  useMidi,
} from '../../../../hooks';

export const MappingForm = ({ mapping }) => {
  const { onMIDIMessage } = useMidi();
  const [assignedControl, setAssignedControl] = useState(null);
  const { saveMapping } = useMappings();

  const handleAssignMIDIControl = useCallback(() => {
    const unsubscribe = onMIDIMessage((message) => {
      const { keyId, keyType } = message;

      setAssignedControl({ keyId, keyType });

      unsubscribe();
    });
  }, []);

  const handleSaveMapping = useCallback((e) => {
    e.preventDefault();

    const { keyId, keyType, vjdId, vjdKey } = e.target.elements;

    const data = {
      keyType: keyType.value,
      keyId: keyId.value,
      vjdId: vjdId.value,
      vjdKey: vjdKey.value,
    };

    saveMapping(data);
  }, [saveMapping]);

  return (
    <form onSubmit={handleSaveMapping}>
      <button onClick={handleAssignMIDIControl}>
        {
          assignedControl
            ? <span>assigned control: {assignedControl.keyType} {assignedControl.keyId}. Click again to re-assign.</span>
            : <span>assign control</span>
        }
      </button>
      <input type="hidden" name="keyType" value={assignedControl?.keyType} />
      <input type="hidden" name="keyId" value={assignedControl?.keyId} />
      <label for="vjdId">VJD id</label>
      <input name="vjdId" type="number" />
      <label for="vjdKey">VJD axis</label>
      <input name="vjdKey" type="text" />
      <button type="submit">Save mapping</button>
    </form>
  );
};
