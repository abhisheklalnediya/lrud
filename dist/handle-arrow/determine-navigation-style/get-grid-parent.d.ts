import { FocusState, Node } from '../../types';
interface GetGridParent {
    focusState: FocusState;
    focusedNode: Node;
}
interface GetGridParentReturn {
    gridNode: Node;
    rowNode: Node;
}
export default function getGridParent({ focusState, focusedNode, }: GetGridParent): GetGridParentReturn | null;
export {};
