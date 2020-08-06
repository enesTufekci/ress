import { ResourceLoadResponse, ResourceContext } from './types';

function createCacheKey<T>(params: T) {
  return `${JSON.stringify(params)}`;
}

export function getGlobalContext() {
  if (typeof window !== 'undefined' && window.__RESS_RESOURCE_CONTEXT__) {
    return window.__RESS_RESOURCE_CONTEXT__;
  }
  return;
}

export function createResourceContext(
  resourceResponses: ResourceLoadResponse<any, any>[] = []
): ResourceContext {
  let globalContext = getGlobalContext();
  let cacheLookup = globalContext ? globalContext.cacheLookup : new Map<string, Map<string, any>>();

  function getResourceCache(label: string) {
    if (!cacheLookup?.has(label)) {
      cacheLookup.set(label, new Map<string, unknown>());
    }
    return cacheLookup.get(label);
  }

  resourceResponses.forEach((response) => {
    if (response) {
      let { label, params, data } = response;
      let cacheKey = createCacheKey(params);
      getResourceCache(label)?.set(cacheKey, data);
    }
  });

  function flushResourceCache(label: string) {
    cacheLookup.delete(label);
  }

  function cacheGetter<T, U>(label: string) {
    let resourceCache = getResourceCache(label);

    let get = (params: T): U | null => {
      let cacheKey = createCacheKey(params);
      if (resourceCache?.has(cacheKey)) {
        return resourceCache.get(cacheKey);
      }
      return null;
    };

    let set = (params: T, data: U): void => {
      let cacheKey = createCacheKey(params);
      resourceCache?.set(cacheKey, data);
    };

    let _delete = (params: T): void => {
      let cacheKey = createCacheKey(params);
      resourceCache?.delete(cacheKey);
    };

    let flush = () => {
      flushResourceCache(label);
    };

    return {
      get,
      set,
      delete: _delete,
      flush,
      resourceCache,
    };
  }
  return {
    cacheGetter,
    cacheLookup,
  };
}
