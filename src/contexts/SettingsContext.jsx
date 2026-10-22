import React, { useState } from 'react';
import { CONTACT_INFO as STATIC_CONTACT_INFO } from '../constants';
import { SettingsContext } from '../hooks/useSettings';

export const SettingsProvider = ({ children }) => {
  const [settings] = useState(STATIC_CONTACT_INFO);

  return (
    <SettingsContext.Provider value={{ settings, isLoading: false }}>
      {children}
    </SettingsContext.Provider>
  );
};
