import React from 'react';

import { MappingForm } from './mapping-form';
import { MappingView } from './mapping-view';

export const Mapping = ({ mapping }) => {
  const isEditing = false;

  return isEditing
    ? <MappingForm mapping={mapping} />
    : <MappingView mapping={mapping} />;
};
