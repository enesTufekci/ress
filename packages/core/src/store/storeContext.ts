import { BehaviourSubject } from '../BehaviourSubject';
import { InitializedStore } from './initializeStore';
import { StoreContext, Store } from './types';

function getGlobalContext() {
  if (typeof window !== 'undefined' && window.__RESS_STORE_CONTEXT__) {
    return window.__RESS_STORE_CONTEXT__;
  }
  return;
}

export function createStoreContext(initializedStores: InitializedStore<any>[]): StoreContext {
  let globalContext = getGlobalContext();
  let stateSubjectLookup: Map<string, BehaviourSubject<any>> = globalContext
    ? globalContext.stateSubjectLookup
    : new Map<string, BehaviourSubject<any>>();

  function getStateSubject<T>(label: string, initialState: T): BehaviourSubject<T> {
    if (!stateSubjectLookup.has(label)) {
      stateSubjectLookup.set(label, new BehaviourSubject(initialState));
    }
    return stateSubjectLookup.get(label)!;
  }

  function getStoreCurrentState<T>(store: Omit<Store<T, any>, 'dispatch'>): T {
    let { label, initialState } = store;
    return Object.fromEntries(
      Object.entries(initialState).map(([key, value]) => [
        key,
        getStateSubject(`${label}:${key}`, value).getValue(),
      ])
    ) as T;
  }

  function getStoreSubject<T>(store: Omit<Store<T, any>, 'dispatch'>): BehaviourSubject<T> {
    let storeSubject$ = new BehaviourSubject(getStoreCurrentState(store));

    Object.entries(store.initialState).forEach(([key, value]) => {
      getStateSubject(`${store.label}:${key}`, value).subscribe((next) => {
        storeSubject$.next({
          ...storeSubject$.getValue(),
          [key]: next,
        });
      });
    });

    return storeSubject$;
  }

  initializedStores.forEach((store) => {
    let { label, state } = store;
    Object.entries(state).forEach(([key, value]) => {
      let stateSubjectKey = `${label}:${key}`;
      // When initilazing a store previous state subjects need to be destroyed
      // to prevent updating a component deeply nested in the component tree before re-rendering the whole tree
      // because initializing a store can only happen on top of component tree
      stateSubjectLookup.get(stateSubjectKey)?.destroy();
      stateSubjectLookup.delete(stateSubjectKey);
      stateSubjectLookup.set(stateSubjectKey, new BehaviourSubject(value));
    });
  });

  return {
    stateSubjectLookup,
    getStoreSubject,
    getStateSubject,
    getStoreCurrentState,
  };
}
