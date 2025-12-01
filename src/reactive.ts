type UpdateCallback<T> = (newValue: T) => void;

export class Reactive<T> {
  #value: T;
  #subscribers: Set<UpdateCallback<T>> = new Set();

  public constructor(newValue: T) {
    this.#value = newValue;
  }

  public get value(): T {
    return this.#value;
  }

  public set value(newValue: T) {
    this.#value = newValue;

    // Call every subscriber
    this.#subscribers.forEach(callback => {
      callback(this.#value);
    });
  }

  public subscribe(callback: UpdateCallback<T>): () => void {
    this.#subscribers.add(callback);

    // Immediately call with current state
    callback(this.#value);

    // Return unsubscribe function
    return () => this.#subscribers.delete(callback);
  }
}