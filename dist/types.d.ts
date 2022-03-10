import { Ref, RefObject } from 'react';
export declare type Orientation = 'horizontal' | 'vertical';
export declare type Direction = 'forward' | 'backward';
export declare type Id = string;
export declare type FocusChildIndex = number;
export declare type NodeIdentifier = Id | FocusChildIndex;
export declare type NodeHierarchy = Id[];
export declare type Arrow = 'right' | 'left' | 'up' | 'down';
export declare type NavigationStyle = 'first-child' | 'grid';
export declare type ButtonKey = 'select' | 'back';
export declare type LRUDKey = Arrow | 'select' | 'back';
export declare type ReactNodeRef = Ref<HTMLElement>;
export interface LRUDEvent {
    key: LRUDKey;
    isArrow: boolean;
    targetNode: Node;
    node: Node;
    preventDefault: () => void;
    stopPropagation: () => void;
}
export interface MoveEvent {
    orientation: Orientation;
    direction: Direction;
    arrow: Arrow;
    node: Node;
    prevChildIndex: number | null;
    nextChildIndex: number;
    prevChildNode: Node | null;
    nextChildNode: Node;
}
export interface GridMoveEvent {
    orientation: Orientation;
    direction: Direction;
    arrow: Arrow;
    gridNode: Node;
    prevRowIndex: number;
    nextRowIndex: number;
    prevColumnIndex: number;
    nextColumnIndex: number;
}
export interface FocusEvent {
    focusNode: Node | undefined;
    blurNode: Node | undefined;
    currentNode: Node;
}
export declare type NodeNavigationItem = 'default' | 'grid-container' | 'grid-row' | 'grid-item';
export interface LRUDFocusEvents {
    onKey?: (e: LRUDEvent) => void;
    onArrow?: (e: LRUDEvent) => void;
    onLeft?: (e: LRUDEvent) => void;
    onRight?: (e: LRUDEvent) => void;
    onUp?: (e: LRUDEvent) => void;
    onDown?: (e: LRUDEvent) => void;
    onSelected?: (e: LRUDEvent) => void;
    onBack?: (e: LRUDEvent) => void;
}
export interface FocusNodeEvents extends LRUDFocusEvents {
    onMove?: (e: MoveEvent) => void;
    onGridMove?: (e: GridMoveEvent) => void;
    onFocused?: (e: FocusEvent) => void;
    onBlurred?: (e: FocusEvent) => void;
}
export interface BaseNode extends FocusNodeEvents {
    focusId: Id;
    children: Id[];
    focusedChildIndex: null | number;
    prevFocusedChildIndex: null | number;
    active: boolean;
    isExiting: boolean;
}
export interface RootFocusNode extends BaseNode {
    elRef: RefObject<null>;
    isRoot: true;
    parentId: null;
    isFocused: boolean;
    isFocusedLeaf: boolean;
    orientation: Orientation;
    wrapping: boolean;
    disabled: boolean;
    trap: boolean;
    defaultFocusChild?: number | (() => number);
    defaultFocusColumn: number;
    defaultFocusRow: number;
    forgetTrapFocusHierarchy: boolean;
    navigationStyle: NavigationStyle;
    nodeNavigationItem: NodeNavigationItem;
    _gridColumnIndex: null | number;
    _gridRowIndex: null | number;
    wrapGridVertical: boolean;
    wrapGridHorizontal: boolean;
    _focusTrapPreviousHierarchy: NodeHierarchy;
}
export declare type Listener = () => void;
export interface NodeUpdate {
    disabled?: boolean;
    isExiting?: boolean;
    wrapping?: boolean;
    trap?: boolean;
    forgetTrapFocusHierarchy?: boolean;
    defaultFocusColumn?: number;
    defaultFocusRow?: number;
    defaultFocusChild?: number | (() => number);
}
export interface FocusNode extends BaseNode {
    elRef: RefObject<HTMLElement | null>;
    isRoot: false;
    parentId: string;
    isFocused: boolean;
    isFocusedLeaf: boolean;
    orientation: Orientation;
    wrapping: boolean;
    trap: boolean;
    disabled: boolean;
    navigationStyle: NavigationStyle;
    nodeNavigationItem: NodeNavigationItem;
    defaultFocusChild?: number | (() => number);
    defaultFocusColumn: number;
    defaultFocusRow: number;
    forgetTrapFocusHierarchy: boolean;
    wrapGridVertical: boolean;
    wrapGridHorizontal: boolean;
    _gridColumnIndex: null | number;
    _gridRowIndex: null | number;
    _focusTrapPreviousHierarchy: NodeHierarchy;
}
export declare type Node = FocusNode | RootFocusNode;
export interface NodeMap {
    [key: string]: Node | undefined;
}
export declare type InteractionMode = 'lrud' | 'pointer';
export interface FocusState {
    focusedNodeId: Id;
    activeNodeId: Id | null;
    focusHierarchy: Id[];
    interactionMode: InteractionMode;
    nodes: NodeMap;
    _updatingFocusIsLocked: boolean;
    _hasPointerEventsEnabled: boolean;
}
export interface NodeDefinition extends FocusNodeEvents {
    focusId: Id;
    elRef: RefObject<HTMLElement | null>;
    wrapping?: boolean;
    orientation?: Orientation;
    trap?: boolean;
    navigationStyle?: NavigationStyle;
    initiallyDisabled?: boolean;
    defaultFocusChild?: number | (() => number);
    wrapGridVertical?: boolean;
    wrapGridHorizontal?: boolean;
    isExiting?: boolean;
    defaultFocusColumn?: number;
    defaultFocusRow?: number;
    forgetTrapFocusHierarchy?: boolean;
    onMountAssignFocusTo?: Id;
    focusedChildIndex?: null | number;
    prevFocusedChildIndex?: null | number;
}
export declare type UpdateNode = (nodeId: Id, update: NodeUpdate) => void;
export interface FocusStore {
    subscribe: (listener: Listener) => () => void;
    getState: () => FocusState;
    createNodes: (nodeHierarchy: Node[], nodeDefinitionHierarchy: NodeDefinition[]) => void;
    deleteNode: (nodeId: Id) => void;
    setFocus: (nodeId: Id) => void;
    updateNode: UpdateNode;
    handleArrow: (arrow: Arrow) => void;
    handleSelect: (nodeId?: Id) => void;
    configurePointerEvents: (enablePointerEvents: boolean) => void;
    destroy: () => void;
    processKey: {
        select: () => void;
        back: () => void;
        down: () => void;
        left: () => void;
        right: () => void;
        up: () => void;
    };
}
export interface ProviderValue {
    store: FocusStore;
    focusDefinitionHierarchy: NodeDefinition[];
    focusNodesHierarchy: Node[];
}
export declare type PropsFromNode = (node: Node) => FocusNodeProps;
export interface FocusNodeProps extends FocusNodeEvents {
    elementType?: React.ElementType;
    focusId?: Id;
    className?: string;
    children?: React.ReactNode;
    wrapping?: boolean;
    wrapGridVertical?: boolean;
    wrapGridHorizontal?: boolean;
    orientation?: Orientation;
    isGrid?: boolean;
    isTrap?: boolean;
    forgetTrapFocusHierarchy?: boolean;
    propsFromNode?: PropsFromNode;
    isExiting?: boolean;
    onMountAssignFocusTo?: Id;
    disabled?: boolean;
    defaultFocusChild?: number | (() => number);
    onClick?: (e: any) => void;
    onMouseOver?: (e: any) => void;
    defaultFocusColumn?: number;
    defaultFocusRow?: number;
    focusedClass?: string;
    focusedLeafClass?: string;
    disabledClass?: string;
    activeClass?: string;
}
export interface GridStyle {
    style: 'grid';
    gridNode: Node;
    rowNode: Node;
}
export interface DefaultStyle {
    style: 'default';
    targetNode: Node;
}
