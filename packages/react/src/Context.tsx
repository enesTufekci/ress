import * as React from 'react';

import {
  createResourceContext,
  ResourceContext,
  ResourceLoadResponse,
  createStoreContext,
  InitializedStore,
  StoreContext,
} from '@ress/core';

interface RessContextValue {
  resourceContext: ResourceContext;
  storeContext: StoreContext;
}

export let RessContext = React.createContext({} as RessContextValue);

interface RessProviderProps {
  resourceLoadResponses: ResourceLoadResponse<any, any>[];
  initializedStores: InitializedStore<any>[];
}

export let RessProvider: React.FC<RessProviderProps> = ({
  children,
  resourceLoadResponses,
  initializedStores,
}) => {
  let resourceContext = React.useRef(
    (() => {
      let ctx = createResourceContext(resourceLoadResponses);

      if (typeof window !== 'undefined') {
        window.__RESS_RESOURCE_CONTEXT__ = ctx;
      }

      return ctx;
    })()
  );

  let storeContext = React.useRef(
    (() => {
      let ctx = createStoreContext(initializedStores);

      if (typeof window !== 'undefined') {
        window.__RESS_STORE_CONTEXT__ = ctx;
      }

      return ctx;
    })()
  );

  return (
    <RessContext.Provider
      value={{
        resourceContext: resourceContext.current,
        storeContext: storeContext.current,
      }}
    >
      {children}
    </RessContext.Provider>
  );
};
