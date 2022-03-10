import { NodeMap, FocusState, NodeHierarchy } from '../types';
interface GetNodesFromFocusChangeOptions {
    focusState: FocusState;
    blurHierarchy: NodeHierarchy;
    focusHierarchy: NodeHierarchy;
    unchangedHierarchy: NodeHierarchy;
}
export default function getNodesFromFocusChange({ focusState, blurHierarchy, focusHierarchy, unchangedHierarchy, }: GetNodesFromFocusChangeOptions): NodeMap;
export {};
