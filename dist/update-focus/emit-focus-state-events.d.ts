import { NodeHierarchy, FocusState } from '../types';
export default function emitFocusStateEvents({ focus, blur, focusState, }: {
    focus: NodeHierarchy;
    blur: NodeHierarchy;
    focusState: FocusState;
}): void;
