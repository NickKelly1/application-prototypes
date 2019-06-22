import React, { FC, createContext, useContext, useState } from "react";
import { createApplicationStore } from "../../store/application-store";

const store = createApplicationStore();
(window as any).applicationStore = store;

export const ApplicationStoreContext = createContext<null | typeof store>(null);

/**
 * @description
 * Provides access to the applications store
 *
 * @param props
 */
export const ApplicationStoreProvider: FC = ({children}) => {
  const [state, setState] = useState(() => store)


  return (
    <ApplicationStoreContext.Provider value={context}>
      {children}
    </ApplicationStoreContext.Provider>
  );
}
