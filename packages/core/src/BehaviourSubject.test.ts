import { BehaviourSubject } from './BehaviourSubject';

describe('BehaviourSubject', () => {
  it('handles subscriptions', () => {
    const test$ = new BehaviourSubject(0);
    expect(test$.getValue()).toEqual(0);
    const mock1 = jest.fn();
    const sub1 = test$.subscribe(mock1);

    const mock2 = jest.fn();
    const sub2 = test$.subscribe(mock2);

    test$.next(1);
    expect(mock1).toHaveBeenCalledTimes(1);
    expect(mock2).toHaveBeenCalledTimes(1);
    expect(test$.getValue()).toEqual(1);

    sub1.unsubscribe();
    test$.next(2);

    expect(mock1).toHaveBeenCalledTimes(1);
    expect(mock2).toHaveBeenCalledTimes(2);
    expect(test$.getValue()).toEqual(2);

    sub2.unsubscribe();
    test$.next(3);
    expect(mock1).toHaveBeenCalledTimes(1);
    expect(mock2).toHaveBeenCalledTimes(2);
    expect(test$.getValue()).toEqual(3);
  });
});
