import { FocusState, Id, Orientation } from '../types';
interface UpdateFocusOptions {
    focusState: FocusState;
    assignFocusTo: Id | null | undefined;
    orientation?: Orientation;
    preferEnd?: boolean;
}
export default function updateFocus({ focusState, assignFocusTo, orientation, preferEnd, }: UpdateFocusOptions): FocusState;
export {};
