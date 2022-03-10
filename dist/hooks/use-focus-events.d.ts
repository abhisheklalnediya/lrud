import { Id, Node } from '../types';
declare type EventCallback = (node: Node) => void;
interface Events {
    focus?: EventCallback;
    blur?: EventCallback;
    active?: EventCallback;
    inactive?: EventCallback;
    disabled?: EventCallback;
    enabled?: EventCallback;
}
export default function useFocusEvents(nodeId: Id, events?: Events): void;
export {};
