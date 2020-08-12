export type Orientation = 'horizontal' | 'vertical';
export type Direction = 'forward' | 'backward';

export type Id = string;
export type FocusChildIndex = number;
export type NodeIdentifier = Id | FocusChildIndex;

export type NodeHierarchy = Id[];

export type Arrow = 'right' | 'left' | 'up' | 'down';

export type NavigationStyle = 'first-child' | 'grid';

export type ButtonKey = 'select' | 'back';
export type LRUDKey = Arrow | 'select' | 'back';

export interface LRUDEvent {
  key: LRUDKey;
  isArrow: boolean;
  node: Node;
  preventDefault: () => void;
  stopPropagation: () => void;
}

export type NodeNavigationItem =
  | 'default'
  | 'grid-container'
  | 'grid-row'
  | 'grid-item';

export interface FocusNodeEvents {
  onKey?: (e: LRUDEvent) => void;
  onArrow?: (e: LRUDEvent) => void;
  onLeft?: (e: LRUDEvent) => void;
  onRight?: (e: LRUDEvent) => void;
  onUp?: (e: LRUDEvent) => void;
  onDown?: (e: LRUDEvent) => void;
  onSelect?: (e: LRUDEvent) => void;
  onBack?: (e: LRUDEvent) => void;

  onMove?: (e: any) => void;
  onGridMove?: (e: any) => void;

  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
}

export interface BaseNode extends FocusNodeEvents {
  id: Id;

  children: Id[];
  focusedChildIndex: null | number;
  prevFocusedChildIndex: null | number;

  active: boolean;

  isExiting: boolean;
}

export interface RootFocusNode extends BaseNode {
  isRoot: true;
  parentId: null;
  isFocused: boolean;
  isFocusedLeaf: boolean;
  orientation: Orientation;
  wrapping: boolean;
  disabled: boolean;
  trap: boolean;

  restoreTrapFocusHierarchy: boolean;

  navigationStyle: NavigationStyle;
  nodeNavigationItem: NodeNavigationItem;
  canReceiveFocusFromArrows: boolean;
  _gridColumnIndex: null | number;
  _gridRowIndex: null | number;
  wrapGridRows: boolean;
  wrapGridColumns: boolean;

  _focusTrapPreviousHierarchy: NodeHierarchy;
}

export type Listener = () => void;

export interface NodeUpdate {
  disabled?: boolean;
  isExiting?: boolean;
}

export interface FocusNode extends BaseNode {
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
  canReceiveFocusFromArrows: boolean;

  restoreTrapFocusHierarchy: boolean;

  wrapGridRows: boolean;
  wrapGridColumns: boolean;
  _gridColumnIndex: null | number;
  _gridRowIndex: null | number;

  _focusTrapPreviousHierarchy: NodeHierarchy;
}

export type Node = FocusNode | RootFocusNode;

export interface NodeMap {
  [key: string]: Node | undefined;
}

export interface FocusState {
  focusedNodeId: Id;
  activeNodeId: Id | null;
  focusHierarchy: Id[];
  nodes: NodeMap;
  _updatingFocusIsLocked: boolean;
}

export interface NodeDefinition extends FocusNodeEvents {
  id: Id;
  wrapping?: boolean;
  orientation?: Orientation;
  trap?: boolean;
  navigationStyle?: NavigationStyle;
  initiallyDisabled?: boolean;
  canReceiveFocusFromArrows?: boolean;

  wrapGridRows?: boolean;
  wrapGridColumns?: boolean;

  isExiting?: boolean;

  restoreTrapFocusHierarchy?: boolean;

  // This will seek out this node identifier, and set focus to it.
  // IDs are more general, but child indices work, too.
  // Only one thing in the entire tree can have this set at a time.
  onMountAssignFocusTo?: Id;

  focusedChildIndex?: null | number;
  prevFocusedChildIndex?: null | number;
}

export type UpdateNode = (nodeId: Id, update: NodeUpdate) => void;

export interface FocusStore {
  subscribe: (listener: Listener) => () => void;
  getState: () => FocusState;
  createNodes: (
    nodeHierarchy: Node[],
    nodeDefinitionHierarchy: NodeDefinition[]
  ) => void;
  deleteNode: (nodeId: Id) => void;
  setFocus: (nodeId: Id) => void;
  updateNode: UpdateNode;
  handleArrow: (arrow: Arrow) => void;
  handleSelect: () => void;
}

export interface ProviderValue {
  store: FocusStore;
  focusDefinitionHierarchy: NodeDefinition[];
  focusNodesHierarchy: Node[];
}

export type PropsFromNode = (node: Node) => FocusNodeProps;

export interface FocusNodeProps extends FocusNodeEvents {
  elementType?: React.ElementType;
  focusId?: Id;
  className?: string;
  children?: React.ReactChild;
  wrapping?: boolean;
  orientation?: Orientation;
  isGrid?: boolean;
  isTrap?: boolean;
  canReceiveFocusFromArrows?: boolean;
  restoreTrapFocusHierarchy?: boolean;
  propsFromNode?: PropsFromNode;
  isExiting?: boolean;
  onMountAssignFocusTo?: Id;
  disabled?: boolean;

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