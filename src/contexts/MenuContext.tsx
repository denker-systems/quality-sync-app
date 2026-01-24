import React, { createContext, useContext, useState, useCallback } from 'react';

interface MenuContextType {
  menuVisible: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

export type MenuContextResult = MenuContextType | null;

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);

  return (
    <MenuContext.Provider value={{ menuVisible, openMenu, closeMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu(): MenuContextResult {
  const context = useContext(MenuContext);
  if (!context) {
    // Return a safe default instead of throwing error
    return null;
  }
  return context;
}
