/**
 * DevConnectionProvider - Global state for dev connection modal
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DevConnectionModal } from './DevConnectionModal';
import { DevConnectionButton } from './DevConnectionButton';

interface DevConnectionContextType {
  showModal: () => void;
  hideModal: () => void;
  isVisible: boolean;
}

const DevConnectionContext = createContext<DevConnectionContextType | undefined>(undefined);

export function useDevConnection() {
  const context = useContext(DevConnectionContext);
  if (!context) {
    throw new Error('useDevConnection must be used within DevConnectionProvider');
  }
  return context;
}

interface DevConnectionProviderProps {
  children: ReactNode;
  enabled?: boolean; // Easy on/off switch
}

export function DevConnectionProvider({ children, enabled = true }: DevConnectionProviderProps) {
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => setIsVisible(true);
  const hideModal = () => setIsVisible(false);

  return (
    <DevConnectionContext.Provider value={{ showModal, hideModal, isVisible }}>
      {children}
      {enabled && (
        <>
          <DevConnectionButton onPress={showModal} />
          <DevConnectionModal visible={isVisible} onClose={hideModal} />
        </>
      )}
    </DevConnectionContext.Provider>
  );
}
