import { StoreContext, ResourceContext } from '@ress/core';
export {};

declare global {
  interface Window {
    __RESS_STORE_CONTEXT__: StoreContext;
    __RESS_RESOURCE_CONTEXT__: ResourceContext;
  }
}
