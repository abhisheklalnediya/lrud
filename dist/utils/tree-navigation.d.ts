import { FocusState, Id, NodeHierarchy, Orientation } from '../types';
interface GetParentsOptions {
    focusState: FocusState;
    nodeId: Id;
    currentFocusHierarchy?: NodeHierarchy;
}
export declare function getParents({ focusState, nodeId, currentFocusHierarchy, }: GetParentsOptions): NodeHierarchy;
interface GetChildrenOptions extends GetParentsOptions {
    orientation?: Orientation;
    preferEnd?: boolean;
    preferredChildren?: NodeHierarchy;
}
export declare function getChildren({ focusState, nodeId, currentFocusHierarchy, orientation, preferEnd, preferredChildren, }: GetChildrenOptions): Id[];
export {};
