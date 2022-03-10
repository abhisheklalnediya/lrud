import { FocusNode, NodeDefinition, Node } from '../types';
export default function nodeFromDefinition({ nodeDefinition, parentNode, }: {
    nodeDefinition: NodeDefinition;
    parentNode: Node;
}): FocusNode;
