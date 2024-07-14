import React from 'react';
import { useRoute } from '../../hooks';

export const Config = () => {
  const { getParts } = useRoute();

  return <div>config {getParts}</div>
};