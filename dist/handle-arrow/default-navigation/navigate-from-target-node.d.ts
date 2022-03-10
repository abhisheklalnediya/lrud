import { Node, FocusState, Direction, Id } from '../../types';
interface NavigateReturn {
    newFocusedId: Id;
    preferEnd: boolean;
}
export default function navigateFromTargetNode({ focusState, targetNode, direction, }: {
    focusState: FocusState;
    targetNode: Node;
    direction: Direction;
}): NavigateReturn | null;
export {};
