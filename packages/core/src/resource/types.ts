export enum ResourceType {
  Query = 'Query',
}

export interface ResourceConfig<T, U> {
  label: string;
  loader: (params: T) => Promise<U | null>;
}

export type ResourceCacheGetter = <T, U>(
  label: string
) => {
  get: (params: T) => U | null;
  set: (params: T, data: U) => void;
  delete: (params: T) => void;
};

export type ResourceContext = {
  cacheGetter: ResourceCacheGetter;
  cacheLookup: Map<string, Map<any, any>>;
};

export interface Resource<T, U> {
  load: (context?: ResourceContext) => (params: T) => Promise<U | null>;
  label: string;
  __type: ResourceType.Query;
}

export interface ResourceLoadResponse<T, U> {
  params: T;
  data: U | null;
  label: string;
}
