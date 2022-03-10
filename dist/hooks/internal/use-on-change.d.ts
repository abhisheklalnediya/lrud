declare type ComparatorFn<Value> = (a: Value, b: Value | undefined) => boolean;
export default function useChange<Value>(val: Value, callback: (currentValue: Value, previousValue: Value | undefined) => void, comparator?: ComparatorFn<Value>): void;
export {};
