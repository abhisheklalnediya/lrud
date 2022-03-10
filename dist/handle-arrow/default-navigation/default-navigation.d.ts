import { FocusState, Node, Orientation, Direction, Arrow } from '../../types';
interface DefaultNavigationOptions {
    focusState: FocusState;
    orientation: Orientation;
    direction: Direction;
    targetNode: Node;
    arrow: Arrow;
}
export default function defaultNavigation({ focusState, orientation, targetNode, direction, arrow, }: DefaultNavigationOptions): FocusState | null;
export {};
