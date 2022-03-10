import { FocusState, Id, Orientation } from '../types';
interface ComputeFocusHierarchyOptions {
    focusState: FocusState;
    assignFocusTo: Id | null | undefined;
    orientation?: Orientation;
    preferEnd?: boolean;
}
export default function computeFocusHierarchy({ focusState, assignFocusTo, orientation, preferEnd, }: ComputeFocusHierarchyOptions): Id[];
export {};
