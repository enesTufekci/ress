import { Resource, ResourceLoadResponse } from './types';
import { getGlobalContext } from './resourceContext';
export async function loadResource<T, U>(
  resource: Resource<T, U>,
  params: T
): Promise<ResourceLoadResponse<T, U>> {
  let { load, label } = resource;
  console.log('getGlobalContext()', getGlobalContext());
  let loader = load(getGlobalContext());

  let data = await loader(params);
  return {
    data,
    label,
    params,
  };
}
