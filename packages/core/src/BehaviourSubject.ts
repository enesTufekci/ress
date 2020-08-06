export type Observer<T> = (value: T) => void;

export interface Subscription {
  unsubscribe: VoidFunction;
}

export class BehaviourSubject<T> {
  value: T;
  observers = new Map<string, Observer<T>>();
  keyCounter = 0;

  constructor(value: T) {
    this.value = value;
  }

  subscribe = (observer: Observer<T>): Subscription => {
    let key = this.keyCounter++;
    this.observers.set(String(key), observer);
    return {
      unsubscribe: () => {
        this.observers.delete(String(key));
      },
    };
  };

  next = (value: T, silent = false) => {
    this.value = value;
    if (!silent) {
      this.observers.forEach((observer) => observer(value));
    }
  };

  getValue = () => {
    return this.value;
  };

  destroy = () => {
    this.observers.clear();
  };
}
