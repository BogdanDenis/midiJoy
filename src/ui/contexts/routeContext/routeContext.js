import React, { useState, useCallback } from 'react';

const RouteContext = React.createContext();

const RouteContextProvider = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('/');
  
  const redirectTo = useCallback((route) => {
    setCurrentRoute(route);
  }, [setCurrentRoute]);

  const getParts = useCallback(() => {
    return currentRoute.split('/').slice(1); // slice because of first / character
  }, [currentRoute]);
  
  return (
    <RouteContext.Provider value={{
      currentRoute,
      redirectTo,
      getParts,
    }}>
      {children}
    </RouteContext.Provider>
  );
};

export {
  RouteContext,
  RouteContextProvider,
};
