import { StoreContext, ResourceContext } from './src';
export {};

declare global {
  interface Window {
    __RESS_STORE_CONTEXT__: StoreContext;
    __RESS_RESOURCE_CONTEXT__: ResourceContext;
  }
}
