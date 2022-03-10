import { FocusState, Node, Orientation, Direction, Arrow, GridStyle, DefaultStyle } from '../../types';
interface DetermineNavigationStyleOptions {
    focusState: FocusState;
    orientation: Orientation;
    direction: Direction;
    focusedNode: Node;
    arrow: Arrow;
}
export default function determineNavigationStyle({ arrow, focusState, focusedNode, direction, orientation, }: DetermineNavigationStyleOptions): GridStyle | DefaultStyle | null;
export {};
