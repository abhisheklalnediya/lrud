import { FocusState, Id } from '../types';
export default function deleteNode({ focusState, nodeId, }: {
    focusState: FocusState;
    nodeId: Id;
}): FocusState | null;
