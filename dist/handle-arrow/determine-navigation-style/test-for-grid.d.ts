import { FocusState, Node, Orientation, Direction, GridStyle } from '../../types';
export default function testForGrid({ focusState, focusedNode, orientation, direction, }: {
    focusState: FocusState;
    focusedNode: Node;
    orientation: Orientation;
    direction: Direction;
}): GridStyle | null;
