import { FocusStore } from '../types';
export default function focusLrud(focusStore: FocusStore): {
    subscribe: (throttleDelay: number) => () => void;
};
