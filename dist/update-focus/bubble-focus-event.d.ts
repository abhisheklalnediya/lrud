import { Id, NodeMap, Node } from '../types';
declare type CallbackName = 'onBlurred' | 'onFocused';
export default function bubbleEvent({ nodeIds, nodes, callbackName, arg, }: {
    nodeIds: Id[];
    nodes: NodeMap;
    callbackName: CallbackName;
    arg: {
        focusNode: Node | undefined;
        blurNode: Node | undefined;
    };
}): void;
export {};
