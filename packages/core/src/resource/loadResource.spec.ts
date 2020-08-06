import { loadResource } from './loadResource';
import { createResource } from './createResource';

describe('loadQueryResource()', () => {
  it('loads query resources', async () => {
    let resource = createResource({
      label: 'test',
      loader: ({ id }: { id: string }) => {
        return Promise.resolve({ id });
      },
    });

    let res = await loadResource(resource, { id: 'abcd' });
    expect(res).toEqual({
      label: 'test',
      params: { id: 'abcd' },
      data: { id: 'abcd' },
    });
  });
});
