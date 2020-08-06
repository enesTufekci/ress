import { createResource } from './createResource';
import { createResourceContext } from './resourceContext';

describe('createResource()', () => {
  it('uses cache', async () => {
    let ctx = createResourceContext();
    let fooLoader = jest.fn();
    let fooResource = createResource({
      label: 'fooResource',
      loader: ({ id }: { id: number }) => {
        fooLoader();
        return Promise.resolve({ id });
      },
    });
    let res = await fooResource.load(ctx)({ id: 1 });
    expect(res).toEqual({ id: 1 });
    expect(fooLoader).toHaveBeenCalledTimes(1);
    await fooResource.load(ctx)({ id: 1 });
    expect(fooLoader).toHaveBeenCalledTimes(1);
  });
});
