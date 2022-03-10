import { FocusState, Node, Orientation, Direction, Arrow } from '../../types';
interface GridNavigationOptions {
    focusState: FocusState;
    orientation: Orientation;
    direction: Direction;
    focusedNode: Node;
    gridNode: Node;
    rowNode: Node;
    arrow: Arrow;
}
export default function gridNavigation({ focusState, orientation, gridNode, rowNode, direction, arrow, }: GridNavigationOptions): FocusState | null;
export {};
