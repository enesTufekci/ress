import { ResourceConfig, ResourceType, Resource, ResourceContext } from './types';

export function createResource<T, U>(config: ResourceConfig<T, U>): Resource<T, U> {
  let { label, loader } = config;

  let load = (context?: ResourceContext) => (params: T) => {
    let cache = context ? context.cacheGetter<T, U>(label) : null;

    if (cache?.get(params)) {
      return Promise.resolve(cache?.get(params));
    } else {
      return loader(params).then((data) => {
        if (data) {
          cache?.set(params, data);
        }
        return data;
      });
    }
  };

  return {
    load,
    label,
    __type: ResourceType.Query,
  };
}
