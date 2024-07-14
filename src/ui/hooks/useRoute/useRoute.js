import { useContext } from 'react';

import { RouteContext } from '../../contexts';

export const useRoute = () => {
  return useContext(RouteContext)
};
