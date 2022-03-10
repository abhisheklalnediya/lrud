import { Id, Orientation, Direction, Node, FocusState } from '../types';
interface GetGridFocusDataReturn {
    targetFocusId: Id;
    currentRowIndex: number;
    currentColumnIndex: number;
    newRowIndex: number;
    newColumnIndex: number;
}
export default function getGridFocusData({ focusState, orientation, direction, gridNode, rowNode, }: {
    focusState: FocusState;
    orientation: Orientation;
    direction: Direction;
    gridNode: Node;
    rowNode: Node;
}): GetGridFocusDataReturn | null;
export {};
