import * as React from 'react';
import { Resource } from '@ress/core';

import { RessContext } from './Context';

type ResourceState<T> = {
  status: 'completed' | 'errored' | 'pending' | 'idle';
  data: T | null;
  error: any;
};

export function useResource<T, U>(resource: Resource<T, U>, params: T) {
  let { resourceContext } = React.useContext(RessContext);
  let { label, load } = resource;
  let [state, setState] = React.useState<ResourceState<U>>({
    status: 'completed',
    data: resourceContext.cacheGetter<T, U>(label).get(params),
    error: null,
  });

  let reload = React.useCallback(() => {
    setState((state) => ({
      ...state,
      status: 'pending',
      error: null,
    }));
    console.log('reload', { resourceContext });
    load(resourceContext)(params)
      .then((data) => {
        setState({
          status: 'completed',
          data,
          error: null,
        });
      })
      .catch((error) => {
        setState((state) => ({
          ...state,
          status: 'errored',
          error,
        }));
      });
  }, [load, params, resourceContext]);

  return {
    reload,
    state,
  };
}
