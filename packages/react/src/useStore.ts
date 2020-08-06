import * as React from 'react';
import { useSubscription, Subscription } from 'use-subscription';
import { Store, Actions } from '@ress/core';

import { RessContext } from './Context';

export function useStore<T, U extends Actions<T>>(store: Store<T, U>) {
  let { label, initialState, dispatch } = store;
  let { storeContext } = React.useContext(RessContext);

  let subject$ = storeContext.getStoreSubject({
    label,
    initialState,
  });

  const subscription: Subscription<T> = React.useMemo(
    () => ({
      getCurrentValue: () => subject$.getValue(),
      subscribe: (callback) => {
        const subscription = subject$.subscribe(callback);
        return () => subscription.unsubscribe();
      },
    }),

    [subject$]
  );

  const state = useSubscription(subscription);
  return { state, dispatch: dispatch(storeContext) };
}
