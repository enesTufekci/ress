import { BehaviourSubject } from '../BehaviourSubject';

export type Actions<T> = Record<string, (state: T) => (p: any) => Partial<T>>;
export type Action<T> = (state: T) => <P>(p: P) => Partial<T>;

export interface Store<T, U extends Actions<T>> {
  label: string;
  initialState: T;
  dispatch: (
    context: StoreContext
  ) =>
    | {
        [K in keyof U]: (params: Parameters<ReturnType<U[K]>>[0]) => void;
      }
    | undefined;
}

export interface StoreContext {
  stateSubjectLookup: Map<string, BehaviourSubject<any>>;
  getStoreSubject: <T>(store: Omit<Store<T, any>, 'dispatch'>) => BehaviourSubject<T>;
  getStateSubject: <T>(label: string, initialState: T) => BehaviourSubject<T>;
  getStoreCurrentState: <T>(store: Omit<Store<T, any>, 'dispatch'>) => T;
}
// stateSubjectLookup,
//     getStoreSubject,
//     getStateSubject,
//     getStoreCurrentState,
