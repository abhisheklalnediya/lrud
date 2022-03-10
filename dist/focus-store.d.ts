import { Orientation, NavigationStyle, FocusStore } from './types';
interface CreateFocusStoreOptions {
    orientation?: Orientation;
    wrapping?: boolean;
    navigationStyle?: NavigationStyle;
    pointerEvents?: boolean;
}
export default function createFocusStore({ orientation, wrapping, pointerEvents, }?: CreateFocusStoreOptions): FocusStore;
export {};
