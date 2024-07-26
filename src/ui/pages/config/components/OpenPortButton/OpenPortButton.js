import React, { useState } from 'react';

import { Button } from '../../../../components';
import { useMidi } from '../../../../hooks';

import css from './OpenPortButton.css';

export const OpenPortButton = ({ currentMidiPort }) => {
  const [isActive, setIsActive] = useState(false);
  const { openPort } = useMidi();

  const handleClick = () => {
    openPort(currentMidiPort.id);
    setIsActive(true);
  };

  return (
    <Button
      containerClass={css.configOpenPortButtonContainer}
      buttonClass={css.configOpenPortButton}
      onClick={handleClick}
      disabled={isActive}
    >
      {isActive ? 'Close' : 'Open'} port
    </Button>
  );
};
