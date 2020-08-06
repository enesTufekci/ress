import { Store, Actions } from './types';

interface StoreConfig<T, U extends Actions<T>> {
  label: string;
  initialState: T;
  actions?: U;
}

type StateValue = string | number | boolean | [];

type State = Record<string, StateValue | Record<string, StateValue>>;

export function createStore<T extends State, U extends Actions<T>>(
  config: StoreConfig<T, U>
): Store<T, U> {
  let { initialState, label, actions } = config;

  let dispatch = ((context) => {
    if (actions) {
      return Object.fromEntries(
        Object.entries(actions).map(([key, fn]) => {
          return [
            key,
            (params: any) => {
              let newState = fn(context.getStoreCurrentState({ label, initialState }))(params);
              Object.entries(newState).forEach(([key, newState]) => {
                context.getStateSubject(`${label}:${key}`, newState).next(newState);
              });
            },
          ];
        })
      );
    }
    return;
  }) as Store<T, U>['dispatch'];

  return { label, initialState, dispatch };
}

// export let fooStore = createStore({
//   label: 'foo',
//   initialState: {
//     foo: 1,
//     bar: 'baz',
//   },
//   actions: {
//     inc: (state) => ({ count }: { count: number }) => ({
//       foo: state.foo + count,
//     }),
//   },
// });
