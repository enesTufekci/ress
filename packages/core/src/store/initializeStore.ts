import { Store } from './types';

export type InitializedStore<T> = {
  label: string;
  state: T;
};

export function initializeStore<T>(store: Store<T, any>, state: Partial<T>): InitializedStore<T> {
  let { label, initialState } = store;
  return {
    label,
    state: { ...initialState, ...state },
  };
}
