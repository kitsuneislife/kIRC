import React, { createContext, useState } from 'react';

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {

  /*const [globalValue, setGlobalValue] = useState('Valor inicial');*/
  const [page, setPage] = useState('home');

  return (
    <GlobalContext.Provider value={{ page, setPage }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
