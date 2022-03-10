import { NodeDefinition, FocusState, NodeMap, Id, Node } from '../types';
interface createNodeDefinitionHierarchyState {
    focusState: FocusState;
    nodeDefinitionHierarchy: NodeDefinition[];
    nodeHierarchy: Node[];
}
interface createNodeDefinitionHierarchyReturn {
    nodes: NodeMap | null;
    assignFocusTo: Id | null;
    shouldLockFocus: boolean;
}
export default function createNodeDefinitionHierarchy({ focusState, nodeDefinitionHierarchy, nodeHierarchy, }: createNodeDefinitionHierarchyState): createNodeDefinitionHierarchyReturn;
export {};
