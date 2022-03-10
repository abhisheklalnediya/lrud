import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle, useContext, useMemo, createElement } from 'react';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var codeCache = {};
function warning(message, code) {
  // This ensures that each warning type is only logged out one time
  if (code) {
    if (codeCache[code]) {
      return;
    }

    codeCache[code] = true;
  }

  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }

  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {// Intentionally blank
  }
}

// From Sindre's math-clamp library
// https://github.com/sindresorhus/math-clamp
// License: https://github.com/sindresorhus/math-clamp/blob/9f17aa114bbdaa99f6ce62f2fed860acaab4d00b/license
//
// Will one day be replaced with:
// https://github.com/rwaldron/proposal-math-extensions
function clamp(x, min, max) {
  if (min > max) {
    throw new RangeError('`min` should be lower than `max`');
  }

  if (x < min) {
    return min;
  }

  if (x > max) {
    return max;
  }

  return x;
}

function getWrappedIndex(index, size) {
  return index - Math.floor(index / size) * size;
}

function getIndex(arrayLength, index, wrap) {
  if (wrap === void 0) {
    wrap = false;
  }

  if (wrap) {
    return getWrappedIndex(index, arrayLength);
  } else {
    return clamp(index, 0, arrayLength - 1);
  }
}

function createNodeDefinitionHierarchy(_ref) {
  var focusState = _ref.focusState,
      nodeDefinitionHierarchy = _ref.nodeDefinitionHierarchy,
      nodeHierarchy = _ref.nodeHierarchy;
  var nodeUpdates = {};
  var onMountAssignFocusToReturn = null;
  var onMountAssignFocusTo = null;
  var shouldLockFocus = focusState._updatingFocusIsLocked;

  for (var i = 0; i < nodeDefinitionHierarchy.length; i++) {
    var node = nodeHierarchy[i];
    var isLastNode = i === nodeDefinitionHierarchy.length - 1;
    var nodeDefinition = nodeDefinitionHierarchy[i];
    var currentNode = focusState.nodes[nodeDefinition.focusId];
    var isCreatingNewNode = !currentNode;

    if (nodeDefinition.onMountAssignFocusTo !== undefined) {
      if (process.env.NODE_ENV !== 'production') {
        if (onMountAssignFocusTo !== null) {
          process.env.NODE_ENV !== "production" ? warning('[Focus]: More than one onMountAssignFocusTo was encountered while creating a new focus subtree. This may represent an error in your code. ' + 'We strongly encourage you to ensure that only a single node is assigned an onMountAssignFocusTo when creating a focus subtree. ' + 'Your onMountAssignFocusTo has been ignored, and the first child will be assigned focus.', 'MORE_THAN_ONE_ONMOUNTFOCUS') : void 0;
        }
      }

      onMountAssignFocusTo = nodeDefinition.onMountAssignFocusTo; // We only actually assign the focus when this thing happens

      if (isLastNode) {
        // We disable the focus lock whenever we "apply" an `onMountAssignFocusTo`
        shouldLockFocus = false;
        onMountAssignFocusToReturn = nodeDefinition.onMountAssignFocusTo;
      } else {
        shouldLockFocus = true;
      }
    }

    if (nodeDefinition.navigationStyle === 'grid' && (nodeDefinition.defaultFocusColumn || nodeDefinition.defaultFocusRow)) {
      if (isLastNode) {
        shouldLockFocus = false;
        var gridNode = focusState.nodes[node.focusId];

        if (gridNode) {
          var _nodeDefinition$defau, _rowNode$children$len, _rowNode$children, _nodeDefinition$defau2;

          var rowIndex = getIndex(gridNode.children.length, (_nodeDefinition$defau = nodeDefinition.defaultFocusRow) != null ? _nodeDefinition$defau : 0, gridNode.wrapGridVertical);
          var newRowNodeId = gridNode.children[rowIndex];
          var rowNode = focusState.nodes[newRowNodeId]; // TODO: fix this

          var rowNodeChildrenLength = (_rowNode$children$len = rowNode == null ? void 0 : (_rowNode$children = rowNode.children) == null ? void 0 : _rowNode$children.length) != null ? _rowNode$children$len : 0;
          var columnIndex = getIndex(rowNodeChildrenLength, (_nodeDefinition$defau2 = nodeDefinition.defaultFocusColumn) != null ? _nodeDefinition$defau2 : 0, gridNode.wrapGridHorizontal);
          var itemIndex = Math.min(columnIndex, Math.max(rowNodeChildrenLength - 1, 0));
          var focusedItemId = rowNode == null ? void 0 : rowNode.children[itemIndex];

          if (focusedItemId) {
            onMountAssignFocusToReturn = focusedItemId;
          }
        }
      } else {
        shouldLockFocus = true; // TODO: warn. This is likely a bug.
      }
    } // If we already have the node, then there is nothing else to do, so we bail
    // (after checking for errors)


    if (!isCreatingNewNode) {
      // NOTE: this check *requires* that this API follow the `useEffect` order of React.
      // The implementation of this feature ties this library very tightly with React.
      var isFinalNode = i === nodeDefinitionHierarchy.length - 1;
      var setFocusGoal = nodeDefinition.onMountAssignFocusTo;

      if (process.env.NODE_ENV !== 'production') {
        if (isFinalNode && setFocusGoal && !focusState.nodes[setFocusGoal]) {
          process.env.NODE_ENV !== "production" ? warning('You configured an onMountAssignFocusTo that was not found in the focus tree. This may represent an error in your application. ' + 'Please make sure that the node specified by onMountAssignFocusTo is created at the same time as the parent.', 'NOT_FOUND_ON_MOUNT_FOCUS') : void 0;
        }
      }

      continue;
    }

    var parentLoopIndex = i - 1;
    var parentDefinition = nodeDefinitionHierarchy[parentLoopIndex];
    var parentId = parentDefinition.focusId;
    var parentNode = focusState.nodes[parentId] || nodeUpdates[parentId];
    var parentChildren = parentNode.children;
    var newParentChildren = Array.isArray(parentChildren) ? parentChildren.concat(nodeDefinition.focusId) : [nodeDefinition.focusId];
    nodeUpdates[parentId] = _extends({}, parentNode, {
      children: newParentChildren
    });
    nodeUpdates[nodeDefinition.focusId] = node;
  }

  return {
    nodes: Object.keys(nodeUpdates).length ? nodeUpdates : null,
    assignFocusTo: onMountAssignFocusToReturn,
    shouldLockFocus: shouldLockFocus
  };
}

function nodeIdIsFocused(focusHierarchy, nodeId) {
  var idIndex = focusHierarchy.indexOf(nodeId);
  return idIndex !== -1;
}

// "Indirect focus" here means:
// 1. receiving focus when a parent node receives focus, either through LRUD input or through an explicit call
//    to `setFocus`
// 2. receiving focus after being mounted
//
// This function ensures that things like disabled nodes don't receive focus when LRUD is input or when they mount.
function nodeCanReceiveIndirectFocus(focusState, node) {
  if (!node) {
    return false;
  }

  if (node.disabled || node.isExiting || node.trap) {
    return false;
  } // This guards against a situation where a child is focusable, but
  // it is not a leaf and has no focusable children.


  var children = node.children || [];

  if (children.length === 0) {
    return true;
  } else {
    var someChildIsEnabled = false;

    for (var i = 0; i < children.length; i++) {
      var childId = children[i];
      var childNode = focusState.nodes[childId];
      var childCanReceiveFocus = nodeCanReceiveIndirectFocus(focusState, childNode);

      if (childCanReceiveFocus) {
        someChildIsEnabled = true;
        break;
      }
    }

    if (!someChildIsEnabled) {
      return false;
    }
  }

  return true;
}

function getParents(_ref) {
  var focusState = _ref.focusState,
      nodeId = _ref.nodeId,
      _ref$currentFocusHier = _ref.currentFocusHierarchy,
      currentFocusHierarchy = _ref$currentFocusHier === void 0 ? [] : _ref$currentFocusHier;
  var node = focusState.nodes[nodeId];

  if (!node) {
    return [];
  }

  var parentId = node.parentId;

  if (parentId === null) {
    return currentFocusHierarchy;
  } else {
    return getParents({
      focusState: focusState,
      nodeId: parentId,
      currentFocusHierarchy: [parentId].concat(currentFocusHierarchy)
    });
  }
}
function getChildren(_ref2) {
  var focusState = _ref2.focusState,
      nodeId = _ref2.nodeId,
      _ref2$currentFocusHie = _ref2.currentFocusHierarchy,
      currentFocusHierarchy = _ref2$currentFocusHie === void 0 ? [] : _ref2$currentFocusHie,
      orientation = _ref2.orientation,
      preferEnd = _ref2.preferEnd,
      preferredChildren = _ref2.preferredChildren;
  var node = focusState.nodes[nodeId];

  if (!node) {
    return [];
  }

  var nodeChildren = node.children.filter(function (childId) {
    var node = focusState.nodes[childId];
    return nodeCanReceiveIndirectFocus(focusState, node);
  });
  var nextPreferredChildren = [];

  if (nodeChildren.length === 0) {
    return currentFocusHierarchy;
  } else {
    // When the node is a grid, and it has no preferred hierarchy, then we respect the defaultFocusRow/defaultFocusColumn
    // attributes. Preferred children represent a focus trap.
    if (node.navigationStyle === 'grid' && (!preferredChildren || preferredChildren.length === 0)) {
      var _node$defaultFocusRow, _node$defaultFocusCol;

      var preferredRowIndex = (_node$defaultFocusRow = node.defaultFocusRow) != null ? _node$defaultFocusRow : 0;
      var rowIndex = clamp(preferredRowIndex, 0, node.children.length - 1);
      var rowId = node.children[rowIndex];
      var row = focusState.nodes[rowId];

      if (!row || row.children.length === 0) {
        return [].concat(currentFocusHierarchy, [rowId]);
      }

      var preferredColumnIndex = (_node$defaultFocusCol = node.defaultFocusColumn) != null ? _node$defaultFocusCol : 0;
      var columnIndex = clamp(preferredColumnIndex, 0, row.children.length - 1);
      var columnId = row.children[columnIndex];
      return getChildren({
        focusState: focusState,
        nodeId: columnId,
        currentFocusHierarchy: [].concat(currentFocusHierarchy, [rowId, columnId]),
        preferredChildren: []
      });
    }

    var nextChildId = nodeChildren[0];
    var numericdefaultFocusChild = typeof node.defaultFocusChild === 'number' && Number.isFinite(node.defaultFocusChild);
    var isValiddefaultFocusChild = numericdefaultFocusChild || typeof node.defaultFocusChild === 'function'; // If the dev explicitly defined an explicit index, then we always use that.

    if (isValiddefaultFocusChild && node.navigationStyle !== 'grid') {
      var childIndex = 0;

      if (numericdefaultFocusChild) {
        // @ts-ignore
        childIndex = node.defaultFocusChild;
      } else {
        // @ts-ignore
        childIndex = node.defaultFocusChild();
      }

      if (typeof childIndex === 'number' && Number.isFinite(childIndex)) {
        var maxChildIndex = Math.max(0, nodeChildren.length - 1);
        childIndex = clamp(childIndex, 0, maxChildIndex);
        nextChildId = nodeChildren[childIndex];
      } else {
        nextChildId = nodeChildren[0];
      }
    } // Otherwise, there are situations where we choose a child other than the
    // first.
    else {
      // `preferredChildren` exist currently when restoring a focus trap's hierarchy
      if (preferredChildren && preferredChildren.length) {
        var possibleId = preferredChildren[0];

        if (focusState.nodes[possibleId]) {
          nextChildId = possibleId;
          nextPreferredChildren = preferredChildren.slice(1);
        }
      } // This allows the focus index to restore to the index in
      // the "direction" of motion. It's not incredibly common, but not so
      // rare that it's an edge case.


      if (orientation && orientation === node.orientation) {
        // TODO: leaving this here in the event that I refactor the
        // preferred column/row implementation above, even though
        // it is currently redundant.
        // @ts-ignore
        var isGridNavigation = node.navigationStyle === 'grid';
        var useLastNode = !isGridNavigation && preferEnd;
        var lastIndex = Math.max(0, nodeChildren.length - 1);
        var index = useLastNode ? lastIndex : 0;
        nextChildId = nodeChildren[index];
      }
    }

    return getChildren({
      focusState: focusState,
      nodeId: nextChildId,
      currentFocusHierarchy: [].concat(currentFocusHierarchy, [nextChildId]),
      preferredChildren: nextPreferredChildren
    });
  }
}

function generateFocusHierarchyFromId(_ref) {
  var focusState = _ref.focusState,
      propagateFromId = _ref.propagateFromId,
      orientation = _ref.orientation,
      preferEnd = _ref.preferEnd;
  var node = focusState.nodes[propagateFromId];
  var preferredChildren = [];

  if (node.trap) {
    preferredChildren = node._focusTrapPreviousHierarchy;
  }

  return [].concat(getParents({
    focusState: focusState,
    nodeId: propagateFromId
  }), [propagateFromId], getChildren({
    focusState: focusState,
    nodeId: propagateFromId,
    orientation: orientation,
    preferEnd: preferEnd,
    preferredChildren: preferredChildren
  }));
}

function computeFocusHierarchy(_ref2) {
  var focusState = _ref2.focusState,
      assignFocusTo = _ref2.assignFocusTo,
      orientation = _ref2.orientation,
      preferEnd = _ref2.preferEnd;
  var explicitlyAssignFocus = typeof assignFocusTo === 'string' && assignFocusTo !== focusState.focusedNodeId;

  if (explicitlyAssignFocus) {
    // @ts-ignore
    var assignedNode = focusState.nodes[assignFocusTo];

    if (process.env.NODE_ENV !== 'production') {
      if (!assignedNode) {
        process.env.NODE_ENV !== "production" ? warning('You attempted to explicitly focus a node that was not found in the focus tree. ' + 'This may represent a bug in your application. ' + 'You should ensure that a node that matches onMountAssignFocusTo is created and not disabled. ' + 'This onMountAssignFocusTo value has been ignored; focus will be computed automatically.', 'EXPLICIT_FOCUS_ERROR') : void 0;
      }
    }

    var focusHierarchy = generateFocusHierarchyFromId({
      focusState: focusState,
      // @ts-ignore
      propagateFromId: assignFocusTo,
      orientation: orientation,
      preferEnd: preferEnd
    });
    return focusHierarchy;
  } else {
    return generateFocusHierarchyFromId({
      focusState: focusState,
      propagateFromId: focusState.focusedNodeId,
      orientation: orientation,
      preferEnd: preferEnd
    });
  }
}

function getFocusDiff(_ref) {
  var _ref$focusHierarchy = _ref.focusHierarchy,
      focusHierarchy = _ref$focusHierarchy === void 0 ? [] : _ref$focusHierarchy,
      _ref$prevFocusHierarc = _ref.prevFocusHierarchy,
      prevFocusHierarchy = _ref$prevFocusHierarc === void 0 ? [] : _ref$prevFocusHierarc;
  var largerIndex = Math.max(focusHierarchy.length, prevFocusHierarchy.length);
  var splitIndex = NaN;

  for (var index = 0; index < largerIndex; index++) {
    var prevId = prevFocusHierarchy[index];
    var currentId = focusHierarchy[index];

    if (prevId !== currentId) {
      splitIndex = index;
      break;
    }
  }

  if (Number.isNaN(splitIndex)) {
    return {
      blur: [],
      focus: [],
      unchanged: prevFocusHierarchy
    };
  }

  var unchanged = prevFocusHierarchy.slice(0, splitIndex);
  var blur = prevFocusHierarchy.slice(splitIndex);
  var focus = focusHierarchy.slice(splitIndex);
  return {
    blur: blur,
    focus: focus,
    unchanged: unchanged
  };
}

function getParentGrid(nodes, node) {
  var parentId = node.parentId;
  var rowNode = nodes[parentId];
  var rowChildren = rowNode.children.filter(function (nodeId) {
    var node = nodes[nodeId];
    return node && !node.disabled && !node.isExiting;
  });
  var columnIndex = rowChildren.indexOf(node.focusId);
  var gridNodeId = rowNode.parentId;
  var gridNode = nodes[gridNodeId];
  var gridChildren = gridNode.children.filter(function (nodeId) {
    var node = nodes[nodeId];
    return node && !node.disabled && !node.isExiting;
  });
  var rowIndex = gridChildren.indexOf(rowNode.focusId);
  return _extends({}, gridNode, {
    _gridColumnIndex: columnIndex,
    _gridRowIndex: rowIndex
  });
}

function getNodesFromFocusChange(_ref) {
  var focusState = _ref.focusState,
      blurHierarchy = _ref.blurHierarchy,
      focusHierarchy = _ref.focusHierarchy,
      unchangedHierarchy = _ref.unchangedHierarchy;
  var result = {};

  for (var i = 0; i < unchangedHierarchy.length; i++) {
    var nodeId = unchangedHierarchy[i];
    var node = focusState.nodes[nodeId];

    if (!node) {
      continue;
    }

    var isLastNode = i === unchangedHierarchy.length - 1;
    var isFocusedLeaf = isLastNode && !focusHierarchy.length;

    if (node.isFocusedLeaf !== isFocusedLeaf) {
      result[nodeId] = _extends({}, node, {
        isFocusedLeaf: isFocusedLeaf
      });
    }

    if (isLastNode && focusHierarchy.length) {
      var childId = focusHierarchy[0];
      var childIndex = node.children.indexOf(childId);
      result[nodeId] = _extends({}, node, result[nodeId], {
        prevFocusedChildIndex: node.focusedChildIndex,
        focusedChildIndex: childIndex
      });
    }
  }

  for (var _i = 0; _i < blurHierarchy.length; _i++) {
    var _nodeId = blurHierarchy[_i];
    var nodeToUpdate = focusState.nodes[_nodeId]; // This guards against the situation where a node has been deleted.

    if (!nodeToUpdate) {
      continue;
    }

    result[_nodeId] = _extends({}, nodeToUpdate, {
      isFocused: false,
      isFocusedLeaf: false,
      prevFocusedChildIndex: nodeToUpdate.focusedChildIndex,
      focusedChildIndex: null
    }); // Upon navigating out of a grid, its "saved" state is reset.

    if (nodeToUpdate.navigationStyle === 'grid') {
      // @ts-ignore
      result[_nodeId]._gridColumnIndex = 0; // @ts-ignore

      result[_nodeId]._gridRowIndex = 0;
    }

    if (nodeToUpdate.trap && !nodeToUpdate.forgetTrapFocusHierarchy) {
      var childHierarchy = blurHierarchy.slice(_i + 1); // @ts-ignore

      result[_nodeId]._focusTrapPreviousHierarchy = childHierarchy;
    }
  }

  for (var _i2 = 0; _i2 < focusHierarchy.length; _i2++) {
    var _nodeId2 = focusHierarchy[_i2];
    var _nodeToUpdate = focusState.nodes[_nodeId2];
    var isLeafNode = _i2 === focusHierarchy.length - 1;
    result[_nodeId2] = _extends({}, _nodeToUpdate, {
      isFocused: true,
      isFocusedLeaf: _i2 === focusHierarchy.length - 1
    });

    if (_nodeToUpdate.trap) {
      // @ts-ignore
      result[_nodeId2]._focusTrapPreviousHierarchy = [];
    }

    if (!isLeafNode) {
      var _childId = focusHierarchy[_i2 + 1];

      var _childIndex = _nodeToUpdate.children.indexOf(_childId); // @ts-ignore


      result[_nodeId2].prevFocusedChildIndex = _nodeToUpdate.focusedChildIndex; // @ts-ignore

      result[_nodeId2].focusedChildIndex = _childIndex;
    }

    if (_nodeToUpdate.nodeNavigationItem === 'grid-item') {
      var updatedGridNode = getParentGrid(_extends({}, focusState.nodes, result), result[_nodeId2]);
      result[updatedGridNode.focusId] = updatedGridNode;
    }
  }

  return result;
}

function bubbleEvent(_ref) {
  var nodeIds = _ref.nodeIds,
      nodes = _ref.nodes,
      callbackName = _ref.callbackName,
      arg = _ref.arg;
  [].concat(nodeIds).reverse().forEach(function (targetNodeId) {
    var node = nodes[targetNodeId];

    if (!node) {
      return;
    }

    var cb = node[callbackName];

    if (typeof cb === 'function') {
      var argToUse = _extends({}, arg, {
        currentNode: node
      });

      cb(argToUse);
    }
  });
}

function emitFocusStateEvents(_ref) {
  var focus = _ref.focus,
      blur = _ref.blur,
      focusState = _ref.focusState;
  var blurNodeId = blur.slice(-1)[0];
  var focusNodeId = focus.slice(-1)[0];
  var blurNode = typeof blurNodeId !== 'undefined' ? focusState.nodes[blurNodeId] : undefined;
  var focusNode = typeof focusNodeId !== 'undefined' ? focusState.nodes[focusNodeId] : undefined;
  bubbleEvent({
    nodeIds: blur,
    nodes: focusState.nodes,
    callbackName: 'onBlurred',
    arg: {
      blurNode: blurNode,
      focusNode: focusNode
    }
  });
  bubbleEvent({
    nodeIds: focus,
    nodes: focusState.nodes,
    callbackName: 'onFocused',
    arg: {
      blurNode: blurNode,
      focusNode: focusNode
    }
  });
}

function updateFocus(_ref) {
  var focusState = _ref.focusState,
      assignFocusTo = _ref.assignFocusTo,
      orientation = _ref.orientation,
      preferEnd = _ref.preferEnd;
  var newFocusHierarchy = computeFocusHierarchy({
    focusState: focusState,
    assignFocusTo: assignFocusTo,
    orientation: orientation,
    preferEnd: preferEnd
  });

  var _getFocusDiff = getFocusDiff({
    focusHierarchy: newFocusHierarchy,
    prevFocusHierarchy: focusState.focusHierarchy
  }),
      blur = _getFocusDiff.blur,
      focus = _getFocusDiff.focus,
      unchanged = _getFocusDiff.unchanged;

  var hierarchyHasChanged = blur.length || focus.length;

  if (!hierarchyHasChanged) {
    return focusState;
  }

  var newNodes = getNodesFromFocusChange({
    focusState: focusState,
    blurHierarchy: blur,
    focusHierarchy: focus,
    unchangedHierarchy: unchanged
  });
  var focusedNodeId;

  if (focus.length) {
    focusedNodeId = focus[focus.length - 1];
  } else {
    focusedNodeId = unchanged[unchanged.length - 1];
  }

  var newState = {
    _updatingFocusIsLocked: false,
    nodes: _extends({}, focusState.nodes, newNodes),
    focusHierarchy: newFocusHierarchy,
    focusedNodeId: focusedNodeId,
    activeNodeId: focusState.activeNodeId,
    interactionMode: focusState.interactionMode,
    _hasPointerEventsEnabled: focusState._hasPointerEventsEnabled
  };
  emitFocusStateEvents({
    focus: focus,
    blur: blur,
    focusState: newState
  });
  return newState;
}

function recursivelyDeleteChildren(nodes, children) {
  children.forEach(function (childId) {
    var childNode = nodes[childId];
    var childChildren = childNode ? childNode.children : null;
    delete nodes[childId];

    if (Array.isArray(childChildren)) {
      recursivelyDeleteChildren(nodes, childChildren);
    }
  });
}

function deleteNode(_ref) {
  var _extends2;

  var focusState = _ref.focusState,
      nodeId = _ref.nodeId;
  var node = focusState.nodes[nodeId];

  if (!node) {
    return null;
  }

  if (nodeId === 'root') {
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== "production" ? warning('You attempted to delete the root node. ' + 'The root node of a focus tree cannot be deleted. ' + 'The focus tree has not been changed;', 'ATTEMPTED_TO_DELETE_ROOT') : void 0;
    }

    return null;
  }

  var parentId = node.parentId; // TODO: use type guards to type this away

  if (!parentId) {
    return null;
  }

  var parentNode = focusState.nodes[parentId];
  var newParentChildren = [];

  if (parentNode.children.length > 1) {
    newParentChildren = parentNode.children.filter(function (id) {
      return id !== nodeId;
    });
  }

  var newNodes = _extends({}, focusState.nodes, (_extends2 = {}, _extends2[parentId] = _extends({}, parentNode, {
    children: newParentChildren
  }), _extends2));

  delete newNodes[nodeId];
  recursivelyDeleteChildren(newNodes, node.children);

  var stateAfterDeletion = _extends({}, focusState, {
    nodes: newNodes
  });

  var nodeWasFocused = nodeIdIsFocused(focusState.focusHierarchy, nodeId);

  if (nodeWasFocused) {
    stateAfterDeletion = updateFocus({
      focusState: stateAfterDeletion,
      assignFocusTo: parentId
    });
  }

  return stateAfterDeletion;
}

function navigateFromTargetNode(_ref) {
  var focusState = _ref.focusState,
      targetNode = _ref.targetNode,
      direction = _ref.direction;
  var parentId = targetNode.parentId;
  var parentNode = focusState.nodes[parentId];

  if (!parentNode) {
    return null;
  }

  var distance = direction === 'forward' ? 1 : -1;
  var wrapping = parentNode.wrapping;
  var preferEnd = direction === 'forward' ? false : true;
  var targetNodeId = targetNode.focusId;
  var allParentsChildren = parentNode.children || [];
  var parentsChildren = allParentsChildren.filter(function (nodeId) {
    var node = focusState.nodes[nodeId];

    if (!node) {
      return false;
    }

    var isEnabled = !node.disabled;
    var isExiting = node.isExiting;
    var canReceiveFocusFromArrow = !node.trap;
    return isEnabled && !isExiting && canReceiveFocusFromArrow;
  });
  var index = parentsChildren.indexOf(targetNodeId);
  var newIndex = getIndex(parentsChildren.length, index + distance, wrapping);
  var newFocusedId = parentsChildren[newIndex];
  var newFocusedNode = focusState.nodes[newFocusedId]; // Disabled/exiting nodes cannot receive focus

  if (!newFocusedNode || newFocusedNode.disabled || newFocusedNode.isExiting) {
    return null;
  }

  return {
    newFocusedId: newFocusedId,
    preferEnd: preferEnd
  };
}

function defaultNavigation(_ref) {
  var focusState = _ref.focusState,
      orientation = _ref.orientation,
      targetNode = _ref.targetNode,
      direction = _ref.direction,
      arrow = _ref.arrow;
  var result = navigateFromTargetNode({
    focusState: focusState,
    targetNode: targetNode,
    direction: direction
  });

  if (!result) {
    return null;
  }

  var newState = updateFocus({
    focusState: focusState,
    orientation: orientation,
    assignFocusTo: result.newFocusedId,
    preferEnd: result.preferEnd
  });
  var parentNode = null;

  if (targetNode.parentId) {
    var _newState$nodes$targe;

    parentNode = (_newState$nodes$targe = newState.nodes[targetNode.parentId]) != null ? _newState$nodes$targe : null;
  }

  var stateChanged = newState !== focusState;

  if (stateChanged && parentNode && typeof parentNode.onMove === 'function') {
    var nextChildIndex = parentNode.focusedChildIndex;
    var prevChildIndex = parentNode.prevFocusedChildIndex;
    var currentFocusedNodeId = parentNode.children[nextChildIndex];
    var currentFocusedNode = newState.nodes[currentFocusedNodeId];
    var prevFocusedNodeId = prevChildIndex === null ? null : parentNode.children[prevChildIndex];
    var prevFocusedNode = prevFocusedNodeId === null ? null : newState.nodes[prevFocusedNodeId];
    parentNode.onMove({
      orientation: orientation,
      direction: direction,
      arrow: arrow,
      node: parentNode,
      prevChildIndex: prevChildIndex,
      nextChildIndex: nextChildIndex,
      prevChildNode: prevFocusedNode != null ? prevFocusedNode : null,
      nextChildNode: currentFocusedNode
    });
  }

  return newState;
}

function getGridFocusData(_ref) {
  var _gridNode$_gridRowInd, _gridNode$_gridColumn;

  var focusState = _ref.focusState,
      orientation = _ref.orientation,
      direction = _ref.direction,
      gridNode = _ref.gridNode,
      rowNode = _ref.rowNode;
  var isVertical = orientation === 'vertical';
  var isForward = direction === 'forward';
  var currentRowIndex = (_gridNode$_gridRowInd = gridNode._gridRowIndex) != null ? _gridNode$_gridRowInd : 0;
  var currentColumnIndex = (_gridNode$_gridColumn = gridNode._gridColumnIndex) != null ? _gridNode$_gridColumn : 0;
  var actualRowIndex = Math.min(currentRowIndex, gridNode.children.length - 1);
  var actualColumnIndex = Math.min(currentColumnIndex, rowNode.children.length - 1);
  var distance = isForward ? 1 : -1;
  var newRowIndex = isVertical ? getIndex(gridNode.children.length, actualRowIndex + distance, gridNode.wrapGridVertical) : actualRowIndex;
  var newColumnIndex = !isVertical ? getIndex(rowNode.children.length, actualColumnIndex + distance, gridNode.wrapGridHorizontal) : currentColumnIndex;
  var newRowNodeId = gridNode.children[newRowIndex];
  var newRowNode = focusState.nodes[newRowNodeId];

  if (!newRowNode) {
    return null;
  }

  var itemIndex = Math.min(newColumnIndex, newRowNode.children.length - 1);
  var newItemNodeId = newRowNode.children[itemIndex];

  if (newItemNodeId === null) {
    return null;
  }

  return {
    targetFocusId: newItemNodeId,
    currentRowIndex: currentRowIndex,
    currentColumnIndex: currentColumnIndex,
    newRowIndex: newRowIndex,
    newColumnIndex: newColumnIndex
  };
}

function gridNavigation(_ref) {
  var _extends2;

  var focusState = _ref.focusState,
      orientation = _ref.orientation,
      gridNode = _ref.gridNode,
      rowNode = _ref.rowNode,
      direction = _ref.direction,
      arrow = _ref.arrow;
  var gridFocusData = getGridFocusData({
    focusState: focusState,
    orientation: orientation,
    direction: direction,
    gridNode: gridNode,
    rowNode: rowNode
  });

  if (!gridFocusData) {
    return null;
  }

  var targetFocusId = gridFocusData.targetFocusId,
      currentRowIndex = gridFocusData.currentRowIndex,
      currentColumnIndex = gridFocusData.currentColumnIndex,
      newRowIndex = gridFocusData.newRowIndex,
      newColumnIndex = gridFocusData.newColumnIndex;
  var updatedFocusTree = updateFocus({
    focusState: focusState,
    orientation: orientation,
    assignFocusTo: targetFocusId,
    preferEnd: false
  }); // TODO: maybe add a check here to verify this is true?

  var updatedGridNode = updatedFocusTree.nodes[gridNode.focusId];
  var rowChanged = currentRowIndex !== newRowIndex;
  var columnChanged = currentColumnIndex !== newColumnIndex;
  var changeOccurred = rowChanged || columnChanged;

  if (changeOccurred && typeof gridNode.onGridMove === 'function') {
    gridNode.onGridMove({
      orientation: orientation,
      direction: direction,
      arrow: arrow,
      gridNode: gridNode,
      prevRowIndex: currentRowIndex,
      nextRowIndex: newRowIndex,
      prevColumnIndex: currentColumnIndex,
      nextColumnIndex: newColumnIndex
    });
  }

  var newState = _extends({}, updatedFocusTree, {
    nodes: _extends({}, updatedFocusTree.nodes, (_extends2 = {}, _extends2[gridNode.focusId] = _extends({}, updatedGridNode, {
      _gridColumnIndex: newColumnIndex,
      _gridRowIndex: newRowIndex
    }), _extends2))
  });

  return newState;
}

function getGridParent(_ref) {
  var focusState = _ref.focusState,
      focusedNode = _ref.focusedNode;

  if (focusedNode.nodeNavigationItem === 'grid-item') {
    var rowNodeId = focusedNode.parentId;
    var rowNode = focusState.nodes[rowNodeId];

    if (!rowNode) {
      return null;
    }

    var gridNodeId = rowNode.parentId;
    var gridNode = focusState.nodes[gridNodeId];

    if (!gridNode) {
      return null;
    }

    return {
      gridNode: gridNode,
      rowNode: rowNode
    };
  } else if (focusedNode.nodeNavigationItem === 'grid-row') {
    var _gridNodeId = focusedNode.parentId;
    var _gridNode = focusState.nodes[_gridNodeId];

    if (!_gridNode) {
      return null;
    }

    return {
      gridNode: _gridNode,
      rowNode: focusedNode
    };
  }

  return null;
}

function testForGrid(_ref) {
  var _gridNode$_gridRowInd, _gridNode$_gridColumn;

  var focusState = _ref.focusState,
      focusedNode = _ref.focusedNode,
      orientation = _ref.orientation,
      direction = _ref.direction;
  var activeGridNodes = getGridParent({
    focusState: focusState,
    focusedNode: focusedNode
  });

  if (!activeGridNodes) {
    return null;
  }

  var gridNode = activeGridNodes.gridNode,
      rowNode = activeGridNodes.rowNode;
  var isVertical = orientation === 'vertical';
  var isForward = direction === 'forward';
  var currentRowIndex = (_gridNode$_gridRowInd = gridNode._gridRowIndex) != null ? _gridNode$_gridRowInd : 0;
  var currentColumnIndex = (_gridNode$_gridColumn = gridNode._gridColumnIndex) != null ? _gridNode$_gridColumn : 0;
  var actualRowIndex = Math.min(currentRowIndex, gridNode.children.length - 1);
  var actualColumnIndex = Math.min(currentColumnIndex, rowNode.children.length - 1);
  var isAtFirstRow = gridNode._gridRowIndex === 0;
  var isAtLastRow = actualRowIndex === gridNode.children.length - 1;
  var isAtFirstColumn = gridNode._gridColumnIndex === 0;
  var isAtLastColumn = actualColumnIndex === rowNode.children.length - 1;
  var movingBackwardVerticallyOnFirstRow = isVertical && !isForward && isAtFirstRow;
  var movingForwardVerticallyOnLastRow = isVertical && isForward && isAtLastRow;
  var movingBackwardHorizontallyOnFirstColumn = !isVertical && !isForward && isAtFirstColumn;
  var movingForwardHorizontallyOnLastColumn = !isVertical && isForward && isAtLastColumn;
  var wouldHandleVertical = gridNode.wrapGridVertical || !movingBackwardVerticallyOnFirstRow && !movingForwardVerticallyOnLastRow;
  var wouldHandleHorizontal = gridNode.wrapGridHorizontal || !movingBackwardHorizontallyOnFirstColumn && !movingForwardHorizontallyOnLastColumn;
  var movementIsWithinTheGrid = isVertical && wouldHandleVertical || !isVertical && wouldHandleHorizontal;

  if (movementIsWithinTheGrid) {
    return {
      style: 'grid',
      gridNode: gridNode,
      rowNode: rowNode
    };
  } else {
    return null;
  }
}

function getDefaultNavTarget(focusState, node, orientation, direction) {
  var parentId = node.parentId;
  var parentNode = focusState.nodes[parentId];

  if (!parentNode) {
    return null;
  }

  if (parentNode.orientation === orientation) {
    if (parentNode.wrapping) {
      return node;
    } else {
      var unfilteredChildren = parentNode.children || []; // We only consider children nodes that can receive focus via arrows

      var parentsChildren = unfilteredChildren.filter(function (nodeId) {
        var node = focusState.nodes[nodeId];

        if (!nodeCanReceiveIndirectFocus(focusState, node)) {
          return false;
        }

        return true;
      });
      var index = parentsChildren.indexOf(node.focusId); // This is true when pressing the "forward" key (right or down) and focus is
      // on the *last* item in the list of children. For example:
      // _ _ _ X

      var movingForwardAndOnLastNode = direction === 'forward' && index === parentsChildren.length - 1; // This is true when pressing the "backward" key (left or up) and focus is
      // on the *first* item in the list of children. For example:
      // X _ _ _

      var movingBackwardAndOnFirstNode = direction === 'backward' && index === 0;

      if (movingForwardAndOnLastNode || movingBackwardAndOnFirstNode) {
        return null;
      } // If that is not true, then focus will remain within this parent and we return the node.
      else {
        return node;
      }
    }
  } else {
    return null;
  }
}

function processNode(_ref) {
  var arrow = _ref.arrow,
      focusState = _ref.focusState,
      node = _ref.node,
      direction = _ref.direction,
      orientation = _ref.orientation;

  // This is the operative line of code that makes focus traps function.
  // When a trap node is encountered, we return null, which signifies
  // no navigation at all.
  // Without this check, this function start traversing up the tree outside of the focus
  // trap, which could potentially cause focus to leave the trap.
  if (node.trap) {
    return null;
  }

  var parentId = node.parentId;
  var parentNode = focusState.nodes[parentId];

  if (!parentNode) {
    return null;
  }

  var isGridNode = node.nodeNavigationItem === 'grid-item' || node.nodeNavigationItem === 'grid-row';

  if (isGridNode) {
    var gridHandle = testForGrid({
      focusState: focusState,
      focusedNode: node,
      direction: direction,
      orientation: orientation
    });

    if (!gridHandle) {
      var activeGridNodes = getGridParent({
        focusState: focusState,
        focusedNode: node
      });

      if (activeGridNodes) {
        return processNode({
          arrow: arrow,
          focusState: focusState,
          node: activeGridNodes.gridNode,
          direction: direction,
          orientation: orientation
        });
      }
    } else {
      return gridHandle;
    }
  }

  var defaultNavigationTargetNode = getDefaultNavTarget(focusState, node, orientation, direction);

  if (defaultNavigationTargetNode) {
    return {
      style: 'default',
      targetNode: defaultNavigationTargetNode
    };
  }

  return processNode({
    arrow: arrow,
    focusState: focusState,
    node: parentNode,
    direction: direction,
    orientation: orientation
  });
}

function determineNavigationStyle(_ref2) {
  var arrow = _ref2.arrow,
      focusState = _ref2.focusState,
      focusedNode = _ref2.focusedNode,
      direction = _ref2.direction,
      orientation = _ref2.orientation;
  var result = processNode({
    arrow: arrow,
    focusState: focusState,
    node: focusedNode,
    direction: direction,
    orientation: orientation
  });
  return result;
}

function handleArrow(_ref) {
  var focusState = _ref.focusState,
      arrow = _ref.arrow;
  var orientation = arrow === 'right' || arrow === 'left' ? 'horizontal' : 'vertical';
  var direction = arrow === 'down' || arrow === 'right' ? 'forward' : 'backward';
  var focusedNode = focusState.nodes[focusState.focusedNodeId];

  if (!focusedNode) {
    return null;
  }

  var navigationStyle = determineNavigationStyle({
    arrow: arrow,
    focusState: focusState,
    focusedNode: focusedNode,
    direction: direction,
    orientation: orientation
  });

  if (!navigationStyle) {
    return null;
  } else if (navigationStyle.style === 'default') {
    return defaultNavigation({
      arrow: arrow,
      focusState: focusState,
      targetNode: navigationStyle.targetNode,
      direction: direction,
      orientation: orientation
    });
  } else if (navigationStyle.style === 'grid') {
    return gridNavigation({
      arrow: arrow,
      focusState: focusState,
      focusedNode: focusedNode,
      gridNode: navigationStyle.gridNode,
      rowNode: navigationStyle.rowNode,
      direction: direction,
      orientation: orientation
    });
  }

  return null;
}

function validateNode(node, nodes, focusState) {
  var enabledNodeChildren = node.children.filter(function (childId) {
    var node = nodes[childId];
    return nodeCanReceiveIndirectFocus(focusState, node);
  });

  if (enabledNodeChildren.length > 0 && node.isFocusedLeaf) {
    console.error('[[ Focus State Internal Error ]]: A focus node has isFocusedLeaf: true, yet it has enabled children.', node, nodes);
  } else if (enabledNodeChildren.length === 0 && node.isFocused && !node.isFocusedLeaf) {
    console.error('[[ Focus State Internal Error ]]: A node is focused, has no enabled children, but does not have isFocusedLeaf: true.', node, nodes);
  }

  if (node.children.length > 1) {
    node.children.forEach(function (childNodeId) {
      if (!nodes[childNodeId]) {
        console.error('[[ Focus State Internal Error ]]: A node has a child that does not exist.', node, nodes);
      }
    });
  }

  if (node.isRoot && node.parentId !== null) {
    console.error('[[ Focus State Internal Error ]]: The root node has a parent.', node, nodes);
  } else if (!node.isRoot) {
    var parentId = node.parentId;

    if (!nodes[parentId]) {
      console.error('[[ Focus State Internal Error ]]: A node has a parent that does not exist.', node, nodes);
    }
  }
}

function enforceStateStructure(focusState) {
  var focusedNodeId = focusState.focusedNodeId;

  if (typeof focusedNodeId !== 'string') {
    console.error('[[ Focus State Internal Error ]]: The focused node ID is not a string.', focusState);
  } else {
    if (!focusState.nodes[focusedNodeId]) {
      console.error('[[ Focus State Internal Error ]]: A focused node is set that does not exist in the node tree.', focusState);
    }
  }

  Object.values(focusState.nodes).forEach(function (node) {
    if (node) {
      validateNode(node, focusState.nodes, focusState);
    }
  });
}

function recursivelyUpdateChildren(nodes, children, update) {
  var newNodes = {};
  children.forEach(function (childId) {
    var childNode = nodes[childId];

    if (!childNode) {
      return;
    }

    var childChildren = childNode ? childNode.children : null;
    newNodes[childNode.focusId] = _extends({}, childNode, update);

    if (Array.isArray(childChildren)) {
      var updatedChildrenNodes = recursivelyUpdateChildren(nodes, childChildren, update);
      newNodes = _extends({}, newNodes, updatedChildrenNodes);
    }
  });
  return newNodes;
}

function executeFunction(node, fn, _ref) {
  var isArrow = _ref.isArrow,
      key = _ref.key,
      targetNode = _ref.targetNode,
      preventDefault = _ref.preventDefault,
      stopPropagation = _ref.stopPropagation;
  var cb = node[fn];

  if (typeof cb === 'function') {
    var arg = {
      isArrow: isArrow,
      key: key,
      node: node,
      stopPropagation: stopPropagation,
      preventDefault: preventDefault,
      targetNode: targetNode
    };
    cb(arg);
  }
}

function bubbleKey(focusTree, key) {
  var state = focusTree.getState();
  var focusHierarchy = state.focusHierarchy;
  var isArrow = key === 'up' || key === 'down' || key === 'right' || key === 'left';
  var isSelect = key === 'select';
  var isBack = key === 'back';
  var defaultPrevented = false;
  var propagationStopped = false;
  var reverseFocusHierarchy = focusHierarchy.slice().reverse();

  if (reverseFocusHierarchy.length) {
    // @ts-ignore
    var preventDefault = function preventDefault() {
      defaultPrevented = true;
    }; // @ts-ignore


    var stopPropagation = function stopPropagation() {
      propagationStopped = true;
    };

    var targetNodeId = reverseFocusHierarchy[0]; // This is the equivalent of event.target within DOM events.

    var targetNode = state.nodes[targetNodeId];
    reverseFocusHierarchy.forEach(function (focusedNodeId) {
      if (propagationStopped) {
        return;
      }

      var node = state.nodes[focusedNodeId];

      if (!node) {
        return;
      }

      executeFunction(node, 'onKey', {
        isArrow: isArrow,
        key: key,
        targetNode: targetNode,
        preventDefault: preventDefault,
        stopPropagation: stopPropagation
      });

      if (isArrow) {
        executeFunction(node, 'onArrow', {
          isArrow: isArrow,
          key: key,
          targetNode: targetNode,
          preventDefault: preventDefault,
          stopPropagation: stopPropagation
        });
      }

      if (key === 'left') {
        executeFunction(node, 'onLeft', {
          isArrow: isArrow,
          key: key,
          targetNode: targetNode,
          preventDefault: preventDefault,
          stopPropagation: stopPropagation
        });
      }

      if (key === 'right') {
        executeFunction(node, 'onRight', {
          isArrow: isArrow,
          key: key,
          targetNode: targetNode,
          preventDefault: preventDefault,
          stopPropagation: stopPropagation
        });
      }

      if (key === 'up') {
        executeFunction(node, 'onUp', {
          isArrow: isArrow,
          key: key,
          targetNode: targetNode,
          preventDefault: preventDefault,
          stopPropagation: stopPropagation
        });
      }

      if (key === 'down') {
        executeFunction(node, 'onDown', {
          isArrow: isArrow,
          key: key,
          targetNode: targetNode,
          preventDefault: preventDefault,
          stopPropagation: stopPropagation
        });
      }

      if (isSelect) {
        executeFunction(node, 'onSelected', {
          isArrow: isArrow,
          key: key,
          targetNode: targetNode,
          stopPropagation: stopPropagation,
          preventDefault: function preventDefault() {}
        });
      }

      if (isBack) {
        executeFunction(node, 'onBack', {
          isArrow: isArrow,
          key: key,
          targetNode: targetNode,
          stopPropagation: stopPropagation,
          preventDefault: function preventDefault() {}
        });
      }
    });
  }

  if (isArrow && !defaultPrevented) {
    /* This cast is, for some reason, required for TSDX */
    focusTree.handleArrow(key);
  } else if (isSelect && !defaultPrevented) {
    focusTree.handleSelect();
  }
}

// will alert subscribers.

var dynamicNodeProps = ['defaultFocusChild', 'disabled', 'isExiting', 'defaultFocusColumn', 'defaultFocusRow', 'wrapping', 'trap', 'forgetTrapFocusHierarchy'];
function createFocusStore(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$orientation = _ref.orientation,
      orientation = _ref$orientation === void 0 ? 'horizontal' : _ref$orientation,
      _ref$wrapping = _ref.wrapping,
      wrapping = _ref$wrapping === void 0 ? false : _ref$wrapping,
      _ref$pointerEvents = _ref.pointerEvents,
      pointerEvents = _ref$pointerEvents === void 0 ? false : _ref$pointerEvents;

  var currentState = {
    focusedNodeId: 'root',
    activeNodeId: null,
    focusHierarchy: ['root'],
    // TODO: should the interaction state values be moved out of the state and placed
    // on the store directly?
    interactionMode: 'lrud',
    _hasPointerEventsEnabled: pointerEvents,
    _updatingFocusIsLocked: false,
    nodes: {
      root: {
        // Note: this a "fake" React ref in that React isn't ensuring
        // that it stays constant.
        elRef: {
          current: null
        },
        focusId: 'root',
        isRoot: true,
        parentId: null,
        active: false,
        isExiting: false,
        isFocused: true,
        isFocusedLeaf: true,
        trap: false,
        disabled: false,
        defaultFocusColumn: 0,
        defaultFocusRow: 0,
        orientation: orientation,
        wrapping: wrapping,
        navigationStyle: 'first-child',
        nodeNavigationItem: 'default',
        forgetTrapFocusHierarchy: true,
        children: [],
        focusedChildIndex: null,
        prevFocusedChildIndex: null,
        _gridColumnIndex: null,
        _gridRowIndex: null,
        wrapGridVertical: false,
        wrapGridHorizontal: false,
        _focusTrapPreviousHierarchy: []
      }
    }
  };
  var listeners = [];

  function subscribe(listener) {
    listeners.push(listener);
    var subscribed = true;
    return function unsubscribe() {
      if (!subscribed) {
        return;
      }

      subscribed = false;
      var index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function onUpdate() {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }
  }

  function createNodes(nodeHierarchy, nodeDefinitionHierarchy) {
    var _createNode = createNodeDefinitionHierarchy({
      focusState: currentState,
      nodeHierarchy: nodeHierarchy,
      nodeDefinitionHierarchy: nodeDefinitionHierarchy
    }),
        nodes = _createNode.nodes,
        assignFocusTo = _createNode.assignFocusTo,
        shouldLockFocus = _createNode.shouldLockFocus;

    if (shouldLockFocus) {
      currentState._updatingFocusIsLocked = shouldLockFocus;
    }

    var hasNodesToUpdate = Boolean(nodes);
    var isUnlockingFocus = !shouldLockFocus && currentState._updatingFocusIsLocked;

    if (hasNodesToUpdate || isUnlockingFocus) {
      var possibleNewState = _extends({}, currentState, {
        nodes: _extends({}, currentState.nodes, nodes)
      }); // When the focus is locked, we "silently" update the state. We may be adding new nodes and so on,
      // but the tree's focus state is not being updated.


      if (shouldLockFocus) {
        currentState = _extends({}, possibleNewState, {
          _updatingFocusIsLocked: true
        });
      } else {
        var nodeHierarchyIds = nodeHierarchy.map(function (node) {
          return node.focusId;
        });
        var focusedItemIndex = nodeHierarchyIds.indexOf(currentState.focusedNodeId);
        var assigningFocusOnMount = nodeDefinitionHierarchy.findIndex(function (v) {
          return v.onMountAssignFocusTo;
        });
        var updatedFocusState = possibleNewState;

        if (focusedItemIndex > -1 || assigningFocusOnMount > -1) {
          updatedFocusState = updateFocus({
            focusState: possibleNewState,
            assignFocusTo: assignFocusTo
          });
        }

        if (updatedFocusState !== currentState) {
          currentState = updatedFocusState;
          onUpdate();
        }
      }
    }
  }

  function deleteNode$1(nodeId) {
    var newState = deleteNode({
      focusState: currentState,
      nodeId: nodeId
    });

    if (newState && newState !== currentState) {
      currentState = newState;
      onUpdate();
    }
  }

  function setFocus(nodeId) {
    var currentNode = currentState.nodes[nodeId];

    if (!currentNode) {
      if (process.env.NODE_ENV !== 'production') {
        if (typeof nodeId !== 'string') {
          process.env.NODE_ENV !== "production" ? warning("You called setFocus with a node ID that is not a string. The node ID that you passed was: " + nodeId + ". All node IDs are strings.", 'NODE_ID_NOT_STRING_TO_SET_FOCUS') : void 0;
        } else {
          process.env.NODE_ENV !== "production" ? warning('You attempted to set focus to a node that does not exist in the focus tree.', 'NODE_DOES_NOT_EXIST') : void 0;
        }
      }

      return;
    } else if (currentNode.disabled) {
      return;
    } else if (currentNode.isExiting) {
      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== "production" ? warning('You attempted to set focus to a node that is exiting. This has no effect, but it may represent a memory leak in your application.', 'FOCUS_SET_TO_EXITING_NODE') : void 0;
      }

      return;
    }

    var updatedFocusState = updateFocus({
      focusState: currentState,
      assignFocusTo: nodeId
    });

    if (updatedFocusState !== currentState) {
      currentState = updatedFocusState;
      onUpdate();
    }
  }

  function getState() {
    return currentState;
  }

  if (process.env.NODE_ENV !== 'production') {
    subscribe(function () {
      enforceStateStructure(currentState);
    });
  }

  function setInteractionMode(newMode) {
    if (newMode === currentState.interactionMode) {
      return;
    }

    var newFocusState = _extends({}, currentState, {
      interactionMode: newMode
    });

    currentState = newFocusState;
  }

  function updateNode(nodeId, update) {
    var currentNode = currentState.nodes[nodeId];

    if (!currentNode) {
      if (process.env.NODE_ENV !== 'production') {
        if (update.disabled) {
          process.env.NODE_ENV !== "production" ? warning('You attempted to disable a node that does not exist in the focus tree. ' + 'This has no effect, but it may represent an error in your code.', 'DISABLE_NODE_THAT_DOES_NOT_EXIST') : void 0;
        }

        if (update.isExiting) {
          process.env.NODE_ENV !== "production" ? warning('You attempted to exit a node that does not exist in the focus tree. ' + 'This has no effect, but it may represent an error in your code.', 'EXIT_NODE_THAT_DOES_NOT_EXIST') : void 0;
        }
      }

      return;
    }

    if (nodeId === 'root') {
      if (process.env.NODE_ENV !== 'production') {
        if (update.disabled) {
          process.env.NODE_ENV !== "production" ? warning('You attempted to disable the root node. ' + 'The root node of a focus tree cannot be disabled. ' + 'This has no effect, but it may represent an error in your code.', 'DISABLE_ROOT_NODE') : void 0;
        }

        if (update.isExiting) {
          process.env.NODE_ENV !== "production" ? warning('You attempted to exit the root node. ' + 'The root node of a focus tree cannot be exited. ' + 'This has no effect, but it may represent an error in your code.', 'EXIT_ROOT_NODE') : void 0;
        }
      }

      return;
    }

    var updateHasDisabled = update.disabled !== undefined;
    var updateHasExiting = update.isExiting !== undefined;

    if (updateHasDisabled) {
      update.disabled = Boolean(update.disabled);
    }

    if (updateHasExiting) {
      update.isExiting = Boolean(update.isExiting);
    }

    var nodeChanged = dynamicNodeProps.some(function (prop) {
      // @ts-ignore
      var updateValue = update[prop];
      var updateValueExists = updateValue !== undefined; // @ts-ignore

      return updateValueExists && currentNode[prop] !== update[prop];
    });

    if (update && nodeChanged) {
      var _update$disabled, _update$isExiting, _update$defaultFocusC, _update$defaultFocusR, _update$wrapping, _update$trap, _update$forgetTrapFoc, _update$defaultFocusC2, _extends2;

      var newNode = _extends({}, currentNode, {
        disabled: (_update$disabled = update.disabled) != null ? _update$disabled : currentNode.disabled,
        isExiting: (_update$isExiting = update.isExiting) != null ? _update$isExiting : currentNode.isExiting,
        defaultFocusColumn: (_update$defaultFocusC = update.defaultFocusColumn) != null ? _update$defaultFocusC : currentNode.defaultFocusColumn,
        defaultFocusRow: (_update$defaultFocusR = update.defaultFocusRow) != null ? _update$defaultFocusR : currentNode.defaultFocusRow,
        wrapping: (_update$wrapping = update.wrapping) != null ? _update$wrapping : currentNode.wrapping,
        trap: (_update$trap = update.trap) != null ? _update$trap : currentNode.trap,
        forgetTrapFocusHierarchy: (_update$forgetTrapFoc = update.forgetTrapFocusHierarchy) != null ? _update$forgetTrapFoc : currentNode.forgetTrapFocusHierarchy,
        defaultFocusChild: (_update$defaultFocusC2 = update.defaultFocusChild) != null ? _update$defaultFocusC2 : currentNode.defaultFocusChild
      });

      var updatedChildren = {};

      if (updateHasExiting || updateHasDisabled) {
        var recursiveUpdate = {};

        if (updateHasDisabled) {
          recursiveUpdate.disabled = update.disabled;
        }

        if (updateHasExiting) {
          recursiveUpdate.isExiting = update.isExiting;
        }

        updatedChildren = recursivelyUpdateChildren(currentState.nodes, newNode.children, // Note: we don't pass the full update as the other attributes (trap, wrapping, etc)
        // only affect the parent, whereas these specific values affect the children.
        recursiveUpdate);
      }

      var nodeWasFocused = currentState.focusHierarchy.find(function (v) {
        return v === nodeId;
      });

      var updatedState = _extends({}, currentState, {
        nodes: _extends({}, currentState.nodes, updatedChildren, (_extends2 = {}, _extends2[nodeId] = newNode, _extends2))
      }); // Only do this if the update actually updated these


      if (nodeWasFocused && (updateHasDisabled || updateHasExiting)) {
        var parentId = newNode.parentId;
        updatedState = updateFocus({
          focusState: updatedState,
          assignFocusTo: parentId
        });
      }

      currentState = updatedState;
      onUpdate();
    }
  }

  function handleArrow$1(arrow) {
    var newState = handleArrow({
      focusState: currentState,
      arrow: arrow
    });

    if (!newState) {
      return;
    }

    if (newState.interactionMode !== 'lrud') {
      newState.interactionMode = 'lrud';
    }

    if (newState !== currentState) {
      currentState = newState;
      onUpdate();
    }
  }

  function handleSelect(focusId) {
    var _newNodes;

    var leafNodeId = typeof focusId === 'string' ? focusId : currentState.focusHierarchy[currentState.focusHierarchy.length - 1];
    var leafNode = currentState.nodes[leafNodeId];

    if (leafNodeId === currentState.activeNodeId) {
      return;
    }

    if (!leafNode) {
      return;
    }

    var newNode = _extends({}, leafNode, {
      active: true
    });

    var newNodes = (_newNodes = {}, _newNodes[leafNodeId] = newNode, _newNodes);

    if (currentState.activeNodeId) {
      var previousActiveNode = currentState.nodes[currentState.activeNodeId];

      if (previousActiveNode) {
        newNodes[currentState.activeNodeId] = _extends({}, previousActiveNode, {
          active: false
        });
      }
    }

    var updatedState = _extends({}, currentState, {
      activeNodeId: leafNodeId,
      nodes: _extends({}, currentState.nodes, newNodes)
    });

    currentState = updatedState;
    onUpdate();
  } // This boolean tracks whether or not we have registered our pointer listeners.
  // This ensures that we never register those listeners more than once.


  var isListeningToPointerEvents = false; // This allows a user to dynamically enable/disable pointer events.

  function configurePointerEvents(enablePointerEvents) {
    var existingState = currentState;
    currentState = _extends({}, existingState, {
      _hasPointerEventsEnabled: enablePointerEvents
    });

    if (enablePointerEvents && !isListeningToPointerEvents) {
      addPointerListeners();
    }

    if (!enablePointerEvents) {
      removePointerListeners();
    }
  }

  var handlingPointerEvent = false;

  function onPointerEvent() {
    if (handlingPointerEvent) {
      return;
    }

    handlingPointerEvent = true;
    requestAnimationFrame(function () {
      setInteractionMode('pointer');
      handlingPointerEvent = false;
    });
  }

  function addPointerListeners() {
    isListeningToPointerEvents = true;
    window.addEventListener('mousemove', onPointerEvent);
    window.addEventListener('mousedown', onPointerEvent);
  }

  function removePointerListeners() {
    isListeningToPointerEvents = false;
    window.removeEventListener('mousemove', onPointerEvent);
    window.removeEventListener('mousedown', onPointerEvent);
  }

  function destroy() {
    removePointerListeners();
  }

  if (pointerEvents) {
    addPointerListeners();
  }

  function internalProcessKey(key) {
    bubbleKey(_focusStore, key);
  }

  var _focusStore = {
    subscribe: subscribe,
    getState: getState,
    createNodes: createNodes,
    deleteNode: deleteNode$1,
    setFocus: setFocus,
    updateNode: updateNode,
    handleArrow: handleArrow$1,
    handleSelect: handleSelect,
    configurePointerEvents: configurePointerEvents,
    destroy: destroy,
    processKey: {
      select: function select() {
        return internalProcessKey('select');
      },
      back: function back() {
        return internalProcessKey('back');
      },
      down: function down() {
        return internalProcessKey('down');
      },
      left: function left() {
        return internalProcessKey('left');
      },
      right: function right() {
        return internalProcessKey('right');
      },
      up: function up() {
        return internalProcessKey('up');
      }
    }
  };
  return _focusStore;
}

function throttle(func, wait, options) {
  // @ts-ignore
  var context, args, result; // @ts-ignore

  var timeout = null;
  var previous = 0;
  if (!options) options = {};

  var later = function later() {
    // @ts-ignore
    previous = options.leading === false ? 0 : Date.now();
    timeout = null; // @ts-ignore

    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  return function () {
    var now = Date.now(); // @ts-ignore

    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous); // @ts-ignore

    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      // @ts-ignore
      if (timeout) {
        // @ts-ignore
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now; // @ts-ignore

      result = func.apply(context, args); // @ts-ignore

      if (!timeout) context = args = null; // @ts-ignore
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    } // @ts-ignore


    return result;
  };
}

// This maps a Key string, returned from an event, to a handler name.
var keyToBindingMap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Enter: 'select',
  Escape: 'back'
};

function focusLrud(focusStore) {
  var lrudMapping = {
    up: function up() {
      focusStore.processKey.up();
    },
    down: function down() {
      focusStore.processKey.down();
    },
    left: function left() {
      focusStore.processKey.left();
    },
    right: function right() {
      focusStore.processKey.right();
    },
    select: function select() {
      focusStore.processKey.select();
    },
    back: function back() {
      focusStore.processKey.back();
    }
  };

  function subscribe(throttleDelay) {
    var keydownHandler = throttle(function (e) {
      // @ts-ignore
      var bindingName = keyToBindingMap[e.key]; // @ts-ignore

      var binding = lrudMapping[bindingName];

      if (typeof binding === 'function') {
        e.preventDefault();
        e.stopPropagation();
        binding();
      }
    }, // TODO: support throttling. Ideally on a per-node basis.
    throttleDelay, {
      trailing: false
    });
    window.addEventListener('keydown', keydownHandler);

    function unsubscribe() {
      window.removeEventListener('keydown', keydownHandler);
    }

    return unsubscribe;
  }

  return {
    subscribe: subscribe
  };
}

var FocusContext = /*#__PURE__*/React.createContext(null);

function FocusRoot(_ref) {
  var orientation = _ref.orientation,
      wrapping = _ref.wrapping,
      children = _ref.children,
      pointerEvents = _ref.pointerEvents,
      _ref$throttle = _ref.throttle,
      throttle = _ref$throttle === void 0 ? 0 : _ref$throttle;
  var rootElRef = useRef(null);

  var _useState = useState(function () {
    if (process.env.NODE_ENV !== 'production') {
      if (orientation !== undefined && orientation !== 'vertical' && orientation !== 'horizontal') {
        process.env.NODE_ENV !== "production" ? warning('An invalid orientation was passed to the FocusRoot. The orientation must either be "vertical" or "horizontal."', 'INVALID_ROOT_ORIENTATION') : void 0;
      }
    }

    var store = createFocusStore({
      orientation: orientation,
      wrapping: wrapping,
      pointerEvents: pointerEvents
    });
    return {
      store: store,
      focusDefinitionHierarchy: [{
        elRef: rootElRef,
        focusId: 'root'
      }],
      focusNodesHierarchy: [store.getState().nodes.root]
    };
  }),
      providerValue = _useState[0];

  useEffect(function () {
    var lrud = focusLrud(providerValue.store);
    var unsubscribe = lrud.subscribe(throttle);
    return function () {
      unsubscribe();
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return React.createElement(FocusContext.Provider, {
    value: providerValue
  }, children);
}

var FocusContext$1 = {
  Context: FocusContext,
  FocusRoot: FocusRoot
};

function nodeFromDefinition(_ref) {
  var _nodeDefinition$navig, _nodeDefinition$orien, _nodeDefinition$forge;

  var nodeDefinition = _ref.nodeDefinition,
      parentNode = _ref.parentNode;
  var elRef = nodeDefinition.elRef,
      onKey = nodeDefinition.onKey,
      onArrow = nodeDefinition.onArrow,
      onLeft = nodeDefinition.onLeft,
      onRight = nodeDefinition.onRight,
      onUp = nodeDefinition.onUp,
      onDown = nodeDefinition.onDown,
      onSelected = nodeDefinition.onSelected,
      onBack = nodeDefinition.onBack,
      onFocused = nodeDefinition.onFocused,
      onBlurred = nodeDefinition.onBlurred,
      defaultFocusColumn = nodeDefinition.defaultFocusColumn,
      defaultFocusRow = nodeDefinition.defaultFocusRow,
      _nodeDefinition$isExi = nodeDefinition.isExiting,
      isExiting = _nodeDefinition$isExi === void 0 ? false : _nodeDefinition$isExi,
      onMove = nodeDefinition.onMove,
      onGridMove = nodeDefinition.onGridMove;
  var parentId = parentNode.focusId;
  var nodeNavigationItem = 'default';

  if (nodeDefinition.navigationStyle === 'grid') {
    nodeNavigationItem = 'grid-container';
  } else if (parentNode && parentNode.navigationStyle === 'grid') {
    nodeNavigationItem = 'grid-row';
  } else if (parentNode && parentNode.nodeNavigationItem === 'grid-row') {
    nodeNavigationItem = 'grid-item';
  }

  var navigationStyle = (_nodeDefinition$navig = nodeDefinition.navigationStyle) != null ? _nodeDefinition$navig : 'first-child';
  var isGridContainer = navigationStyle === 'grid';
  var defaultFocusColumnValue = defaultFocusColumn != null ? defaultFocusColumn : 0;
  var defaultFocusRowValue = defaultFocusRow != null ? defaultFocusRow : 0;
  var node = {
    elRef: elRef,
    focusId: nodeDefinition.focusId,
    isRoot: false,
    parentId: parentId,
    isExiting: isExiting,
    // These will be updated to their actual values within the call to `createNodes` below.
    isFocused: false,
    isFocusedLeaf: false,
    active: false,
    trap: Boolean(nodeDefinition.trap),
    orientation: (_nodeDefinition$orien = nodeDefinition.orientation) != null ? _nodeDefinition$orien : 'horizontal',
    wrapping: Boolean(nodeDefinition.wrapping),
    disabled: Boolean(nodeDefinition.initiallyDisabled),
    navigationStyle: navigationStyle,
    nodeNavigationItem: nodeNavigationItem,
    defaultFocusChild: nodeDefinition.defaultFocusChild,
    defaultFocusColumn: defaultFocusColumnValue,
    defaultFocusRow: defaultFocusRowValue,
    forgetTrapFocusHierarchy: Boolean((_nodeDefinition$forge = nodeDefinition.forgetTrapFocusHierarchy) != null ? _nodeDefinition$forge : false),
    children: [],
    focusedChildIndex: null,
    prevFocusedChildIndex: null,
    _gridColumnIndex: isGridContainer ? defaultFocusColumnValue : null,
    _gridRowIndex: isGridContainer ? defaultFocusRowValue : null,
    wrapGridHorizontal: Boolean(nodeDefinition.wrapGridHorizontal),
    wrapGridVertical: Boolean(nodeDefinition.wrapGridVertical),
    _focusTrapPreviousHierarchy: [],
    onKey: onKey,
    onArrow: onArrow,
    onLeft: onLeft,
    onRight: onRight,
    onUp: onUp,
    onDown: onDown,
    onSelected: onSelected,
    onBack: onBack,
    onFocused: onFocused,
    onBlurred: onBlurred,
    onMove: onMove,
    onGridMove: onGridMove
  };
  return node;
}

function usePrevious(value) {
  var ref = useRef();
  useEffect(function () {
    ref.current = value;
  });
  return ref.current;
}

var _excluded = ["elementType", "focusId", "className", "children", "wrapping", "wrapGridHorizontal", "wrapGridVertical", "orientation", "isGrid", "isTrap", "forgetTrapFocusHierarchy", "defaultFocusColumn", "defaultFocusRow", "disabled", "onMountAssignFocusTo", "defaultFocusChild", "isExiting", "propsFromNode", "focusedClass", "focusedLeafClass", "disabledClass", "activeClass", "onKey", "onArrow", "onLeft", "onRight", "onUp", "onDown", "onSelected", "onBack", "onMove", "onGridMove", "onFocused", "onBlurred", "onClick", "onMouseOver"];
var uniqueId = 0;

function checkForUpdate(_ref) {
  var focusStore = _ref.focusStore,
      id = _ref.id,
      setNode = _ref.setNode,
      currentNode = _ref.currentNode;
  var state = focusStore.getState();
  var newNode = state.nodes[id];

  if (newNode && newNode !== currentNode && !newNode.isExiting) {
    setNode(newNode);
  }
}

function FocusNode(_ref2, ref) {
  var _ref2$elementType = _ref2.elementType,
      elementType = _ref2$elementType === void 0 ? 'div' : _ref2$elementType,
      focusId = _ref2.focusId,
      _ref2$className = _ref2.className,
      className = _ref2$className === void 0 ? '' : _ref2$className,
      children = _ref2.children,
      _ref2$wrapping = _ref2.wrapping,
      wrapping = _ref2$wrapping === void 0 ? false : _ref2$wrapping,
      wrapGridHorizontal = _ref2.wrapGridHorizontal,
      wrapGridVertical = _ref2.wrapGridVertical,
      orientation = _ref2.orientation,
      _ref2$isGrid = _ref2.isGrid,
      isGrid = _ref2$isGrid === void 0 ? false : _ref2$isGrid,
      _ref2$isTrap = _ref2.isTrap,
      isTrap = _ref2$isTrap === void 0 ? false : _ref2$isTrap,
      _ref2$forgetTrapFocus = _ref2.forgetTrapFocusHierarchy,
      forgetTrapFocusHierarchy = _ref2$forgetTrapFocus === void 0 ? false : _ref2$forgetTrapFocus,
      defaultFocusColumn = _ref2.defaultFocusColumn,
      defaultFocusRow = _ref2.defaultFocusRow,
      disabled = _ref2.disabled,
      onMountAssignFocusTo = _ref2.onMountAssignFocusTo,
      defaultFocusChild = _ref2.defaultFocusChild,
      _ref2$isExiting = _ref2.isExiting,
      isExiting = _ref2$isExiting === void 0 ? false : _ref2$isExiting,
      propsFromNode = _ref2.propsFromNode,
      _ref2$focusedClass = _ref2.focusedClass,
      focusedClass = _ref2$focusedClass === void 0 ? 'isFocused' : _ref2$focusedClass,
      _ref2$focusedLeafClas = _ref2.focusedLeafClass,
      focusedLeafClass = _ref2$focusedLeafClas === void 0 ? 'isFocusedLeaf' : _ref2$focusedLeafClas,
      _ref2$disabledClass = _ref2.disabledClass,
      disabledClass = _ref2$disabledClass === void 0 ? 'focusDisabled' : _ref2$disabledClass,
      _ref2$activeClass = _ref2.activeClass,
      activeClass = _ref2$activeClass === void 0 ? 'isActive' : _ref2$activeClass,
      onKey = _ref2.onKey,
      onArrow = _ref2.onArrow,
      onLeft = _ref2.onLeft,
      onRight = _ref2.onRight,
      onUp = _ref2.onUp,
      onDown = _ref2.onDown,
      onSelected = _ref2.onSelected,
      onBack = _ref2.onBack,
      onMove = _ref2.onMove,
      onGridMove = _ref2.onGridMove,
      onFocused = _ref2.onFocused,
      onBlurred = _ref2.onBlurred,
      onClick = _ref2.onClick,
      onMouseOver = _ref2.onMouseOver,
      otherProps = _objectWithoutPropertiesLoose(_ref2, _excluded);

  var elRef = useRef(null); // We store the callbacks in a ref so that we can pass a wrapper function into the underlying
  // focus node within the focus state. This wrapper function stays constant throughout the lifetime
  // of the node, and that wrapper calls this ref.
  // The reason for this roundabout solution is to avoid a situation of an infinite rerenders: if the node
  // itself were updated when the callbacks changed, then this would cause all consumers of the store state
  // to render. Unless consumers are using `useCallback`, this would recreate the handlers, creating an infinite
  // loop.

  var callbacksRef = useRef({
    onKey: onKey,
    onArrow: onArrow,
    onLeft: onLeft,
    onRight: onRight,
    onUp: onUp,
    onDown: onDown,
    onSelected: onSelected,
    onBack: onBack,
    onMove: onMove,
    onGridMove: onGridMove,
    onFocused: onFocused,
    onBlurred: onBlurred,
    onClick: onClick,
    onMouseOver: onMouseOver
  });
  useEffect(function () {
    callbacksRef.current = {
      onKey: onKey,
      onArrow: onArrow,
      onLeft: onLeft,
      onRight: onRight,
      onUp: onUp,
      onDown: onDown,
      onSelected: onSelected,
      onBack: onBack,
      onMove: onMove,
      onGridMove: onGridMove,
      onFocused: onFocused,
      onBlurred: onBlurred,
      onClick: onClick,
      onMouseOver: onMouseOver
    };
  }, [onKey, onArrow, onLeft, onRight, onUp, onDown, onSelected, onBack, onMove, onGridMove, onFocused, onBlurred, onClick, onMouseOver]);
  useImperativeHandle(ref, // I may need to update this based on this comment to make TS happy:
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/46266#issuecomment-662543885
  // However, this code works as expected so I'm @ts-ignoring it.
  // @ts-ignore
  function () {
    return elRef.current;
  });

  var _useState = useState(function () {
    var nonStringFocusId = typeof focusId !== 'string' && focusId !== undefined;
    var reservedFocusId = focusId === 'root';
    var emptyStringNode = focusId + '' === '';
    var invalidNodeId = nonStringFocusId || reservedFocusId || emptyStringNode;

    if (process.env.NODE_ENV !== 'production') {
      if (reservedFocusId) {
        process.env.NODE_ENV !== "production" ? warning('A focus node with an invalid focus ID was created: "root". This is a reserved ID, so it has been ' + 'ignored. Please choose another ID if you wish to specify an ID.', 'ROOT_ID_WAS_PASSED') : void 0;
      }

      if (nonStringFocusId || emptyStringNode) {
        process.env.NODE_ENV !== "production" ? warning('A focus node with an invalid (non-string or empty string) focus ID was created. This is a not supported ID type (expected non-empty string), so it has been ' + 'ignored. Please choose another ID if you wish to specify an ID.', 'INVALID_FOCUS_ID_PASSED') : void 0;
      }
    }

    if (focusId && !invalidNodeId) {
      return focusId;
    } else {
      var id = "node-" + uniqueId;
      uniqueId = uniqueId + 1;
      return id;
    }
  }),
      nodeId = _useState[0];

  var onClickRef = useRef(onClick);
  var onMouseOverRef = useRef(onMouseOver);
  onClickRef.current = onClick;
  onMouseOverRef.current = onMouseOver;
  var defaultForgetFocusTrap = isTrap ? false : undefined;
  var defaultOrientation = !isGrid ? undefined : 'horizontal';
  var contextValue = useContext(FocusContext$1.Context);

  var _useState2 = useState(function () {
    var wrapGridVerticalValue = typeof wrapGridVertical === 'boolean' ? wrapGridVertical : wrapping;
    var wrapGridHorizontalValue = typeof wrapGridHorizontal === 'boolean' ? wrapGridHorizontal : wrapping;

    function createCallbackWrapper(fnName) {
      return function callbackWrapper() {
        // @ts-ignore
        if (callbacksRef.current && // @ts-ignore
        typeof callbacksRef.current[fnName] === 'function') {
          var _callbacksRef$current;

          // @ts-ignore
          (_callbacksRef$current = callbacksRef.current)[fnName].apply(_callbacksRef$current, arguments);
        }
      };
    }

    var nodeDefinition = {
      elRef: elRef,
      focusId: nodeId,
      orientation: orientation || defaultOrientation,
      wrapping: Boolean(wrapping),
      trap: Boolean(isTrap),
      wrapGridHorizontal: wrapGridHorizontalValue,
      wrapGridVertical: wrapGridVerticalValue,
      forgetTrapFocusHierarchy: forgetTrapFocusHierarchy !== undefined ? forgetTrapFocusHierarchy : defaultForgetFocusTrap,
      navigationStyle: isGrid ? 'grid' : 'first-child',
      defaultFocusColumn: defaultFocusColumn != null ? defaultFocusColumn : 0,
      defaultFocusRow: defaultFocusRow != null ? defaultFocusRow : 0,
      onKey: createCallbackWrapper('onKey'),
      onArrow: createCallbackWrapper('onArrow'),
      onLeft: createCallbackWrapper('onLeft'),
      onRight: createCallbackWrapper('onRight'),
      onUp: createCallbackWrapper('onUp'),
      onDown: createCallbackWrapper('onDown'),
      onSelected: createCallbackWrapper('onSelected'),
      onBack: createCallbackWrapper('onBack'),
      onMove: createCallbackWrapper('onMove'),
      onGridMove: createCallbackWrapper('onGridMove'),
      initiallyDisabled: Boolean(disabled),
      onMountAssignFocusTo: onMountAssignFocusTo,
      defaultFocusChild: defaultFocusChild,
      isExiting: isExiting,
      onFocused: onFocused,
      onBlurred: onBlurred
    };

    if (process.env.NODE_ENV !== 'production') {
      if (isGrid && orientation) {
        process.env.NODE_ENV !== "production" ? warning('You passed the orientation prop to a grid focus node. ' + 'This prop has no effect on grid nodes, but it may represent an error in your code. ' + ("This node has a focus ID of " + nodeId + "."), 'ORIENTATION_ON_GRID') : void 0;
      }

      if (isGrid && defaultFocusChild) {
        process.env.NODE_ENV !== "production" ? warning('You passed the defaultFocusChild prop to a grid focus node. ' + 'This prop has no effect on grid nodes, but it may represent an error in your code. ' + ("This node has a focus ID of " + nodeId + "."), 'PREFERRED_CHILD_INDEX_ON_GRID') : void 0;
      }

      if (onGridMove && !isGrid) {
        process.env.NODE_ENV !== "production" ? warning('You passed the onGridMove prop to a node that is not a grid. ' + 'This will have no effect, but it may represent an error in your code. ' + ("This node has a focus ID of " + nodeId + "."), 'GRID_MOVE_NOT_ON_GRID') : void 0;
      } else if (onMove && isGrid) {
        process.env.NODE_ENV !== "production" ? warning('You passed the onMove prop to a grid Focus Node. ' + 'onMove does not work on grid nodes. Did you mean to pass onGridMove instead? ' + ("This node has a focus ID of " + nodeId + "."), 'ON_MOVE_ON_GRID') : void 0;
      }

      if (forgetTrapFocusHierarchy && !nodeDefinition.trap) {
        process.env.NODE_ENV !== "production" ? warning('You passed the forgetTrapFocusHierarchy prop to a focus node that is not a trap. ' + 'This will have no effect, but it may represent an error in your code. ' + ("This node has a focus ID of " + nodeId + "."), 'RESTORE_TRAP_FOCUS_WITHOUT_TRAP') : void 0;
      }
    }

    if (!contextValue) {
      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== "production" ? warning('A FocusProvider was not found in the tree. Did you forget to mount it?', 'NO_FOCUS_PROVIDER_DETECTED') : void 0;
      }

      throw new Error('No FocusProvider.');
    }

    var store = contextValue.store,
        focusDefinitionHierarchy = contextValue.focusDefinitionHierarchy,
        focusNodesHierarchy = contextValue.focusNodesHierarchy;
    var parentNode = focusNodesHierarchy[focusNodesHierarchy.length - 1];
    var initialNode = nodeFromDefinition({
      nodeDefinition: nodeDefinition,
      parentNode: parentNode
    });
    var newDefinitionHierarchy = focusDefinitionHierarchy.concat(nodeDefinition);
    var newNodesHierarchy = focusNodesHierarchy.concat(initialNode);
    var providerValue = {
      store: store,
      focusDefinitionHierarchy: newDefinitionHierarchy,
      focusNodesHierarchy: newNodesHierarchy
    };
    return {
      nodeDefinition: nodeDefinition,
      initialNode: initialNode,
      providerValue: providerValue
    };
  }),
      staticDefinitions = _useState2[0];

  var store = contextValue.store;

  var _useState3 = useState(function () {
    return staticDefinitions.initialNode;
  }),
      node = _useState3[0],
      setNode = _useState3[1];

  var computedProps = useMemo(function () {
    if (typeof propsFromNode === 'function') {
      return propsFromNode(node);
    }

    return {};
  }, [node, propsFromNode]);
  var nodeRef = useRef(node);
  nodeRef.current = node;
  var nodeExistsInTree = useRef(false);
  var dynamicProps = useMemo(function () {
    return {
      disabled: Boolean(disabled),
      isExiting: Boolean(isExiting),
      defaultFocusColumn: defaultFocusColumn,
      defaultFocusRow: defaultFocusRow,
      wrapping: wrapping,
      trap: isTrap,
      forgetTrapFocusHierarchy: forgetTrapFocusHierarchy,
      defaultFocusChild: defaultFocusChild
    };
  }, [disabled, isExiting, defaultFocusColumn, defaultFocusRow, wrapping, isTrap, forgetTrapFocusHierarchy, defaultFocusChild]);
  var prevDynamicProps = usePrevious(dynamicProps);
  useEffect(function () {
    // This ensures that we don't check for updates on the first render.
    if (!nodeExistsInTree.current) {
      return;
    }

    var actualUpdate = {};
    var hasUpdate = false;

    for (var x in dynamicProps) {
      // @ts-ignore
      var currentProp = dynamicProps[x]; // @ts-ignore

      var prevProp = prevDynamicProps[x];

      if (currentProp !== prevProp) {
        hasUpdate = true; // @ts-ignore

        actualUpdate[x] = currentProp;
      }
    }

    if (hasUpdate) {
      store.updateNode(nodeId, actualUpdate);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [dynamicProps, prevDynamicProps]);
  useEffect(function () {
    store.createNodes(staticDefinitions.providerValue.focusNodesHierarchy, staticDefinitions.providerValue.focusDefinitionHierarchy);
    nodeExistsInTree.current = true;
    var unsubscribe = store.subscribe(function () {
      return checkForUpdate({
        focusStore: store,
        id: nodeId,
        setNode: setNode,
        currentNode: nodeRef.current
      });
    }); // We need to manually check for updates. This is because parent nodes won't receive the update otherwise.
    // By the time a parent's useEffect runs, their children will have already instantiated them, so the store
    // will not call "update" as a result of `.createNodes()`

    checkForUpdate({
      focusStore: store,
      id: nodeId,
      setNode: setNode,
      currentNode: nodeRef.current
    });
    return function () {
      nodeExistsInTree.current = false;
      store.deleteNode(nodeId);
      unsubscribe();
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  var classNameString = className + " " + (node.isFocused ? focusedClass : '') + " " + (node.isFocusedLeaf ? focusedLeafClass : '') + " " + (node.disabled ? disabledClass : '') + " " + (computedProps && typeof computedProps.className === 'string' ? computedProps.className : '') + " " + (node.active ? activeClass : '');
  return React.createElement(FocusContext$1.Context.Provider, {
    value: staticDefinitions.providerValue
  }, createElement(elementType, _extends({}, otherProps, computedProps, {
    ref: elRef,
    className: classNameString,
    children: children,
    onMouseOver: function onMouseOver(e) {
      // We only set focus via mouse to the leaf nodes that aren't disabled
      var focusState = staticDefinitions.providerValue.store.getState();

      if (nodeRef.current && nodeRef.current.children.length === 0 && !nodeRef.current.disabled && focusState._hasPointerEventsEnabled && focusState.interactionMode === 'pointer' && nodeExistsInTree.current) {
        staticDefinitions.providerValue.store.setFocus(nodeId);
      }

      if (typeof onMouseOverRef.current === 'function') {
        onMouseOverRef.current(e);
      }
    },
    onClick: function onClick(e) {
      if (typeof onClickRef.current === 'function') {
        onClickRef.current(e);
      }

      var isLeaf = nodeRef.current && nodeRef.current.children.length === 0;
      var isDisabled = nodeRef.current && nodeRef.current.disabled;

      if (!isLeaf || isDisabled) {
        return;
      }

      var focusState = staticDefinitions.providerValue.store.getState();

      if (!focusState._hasPointerEventsEnabled || !nodeExistsInTree.current || focusState.interactionMode !== 'pointer') {
        return;
      }

      if (nodeRef.current && typeof nodeRef.current.onSelected === 'function') {
        // Note: `bubbleKey` fires the events up whatever the current focus hierarchy is, so it might seem
        // weird that we can just assume that this node is always the leaf node of the current hierarchy.
        //
        // It turns out that this works because:
        //   - when pointer events are enabled we always set focus to leaf nodes in `onMouseOver`
        //   - this lib is not intended for touchscreen environments, so all click events will be preceded by a hover
        //   - these pointer events are only handled on leaf nodes
        //
        // If any of those conditions ever change then we will need to revisit this, but for now it should be fine.
        staticDefinitions.providerValue.store.processKey.select();
      }

      staticDefinitions.providerValue.store.handleSelect(nodeId);
    }
  })));
}
var ForwardedFocusNode = /*#__PURE__*/forwardRef(FocusNode);

function useFocusNodeById(focusId) {
  var contextValue = useContext(FocusContext$1.Context);

  var _useState = useState(function () {
    if (!contextValue) {
      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== "production" ? warning('A FocusProvider was not found in the tree. Did you forget to mount it?', 'NO_FOCUS_PROVIDER_DETECTED') : void 0;
      }

      return null;
    } else {
      if (process.env.NODE_ENV !== 'production') {
        if (typeof focusId !== 'string') {
          process.env.NODE_ENV !== "production" ? warning("You passed a non-string focus ID to useFocusNodeById: " + focusId + ". Focus IDs are always strings. " + 'This may represent an error in your code.', 'FOCUS_ID_NOT_STRING') : void 0;
        }
      }

      var focusState = contextValue.store.getState();
      var possibleNode = focusState.nodes[focusId];
      return possibleNode != null ? possibleNode : null;
    }
  }),
      focusNode = _useState[0],
      setFocusNode = _useState[1];

  var focusNodeRef = useRef(focusNode);
  focusNodeRef.current = focusNode;
  var focusIdRef = useRef(focusId);
  focusIdRef.current = focusId;

  function checkForSync() {
    var _contextValue$store$g;

    if (!contextValue) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (typeof focusIdRef.current !== 'string') {
        process.env.NODE_ENV !== "production" ? warning("You passed a non-string focus ID to useFocusNodeById: " + focusId + ". Focus IDs are always strings. " + 'This may represent an error in your code.', 'FOCUS_ID_NOT_STRING') : void 0;
      }
    }

    var currentNode = (_contextValue$store$g = contextValue.store.getState().nodes[focusIdRef.current]) != null ? _contextValue$store$g : null;

    if (currentNode !== focusNodeRef.current) {
      setFocusNode(currentNode);
    }
  }

  useEffect(checkForSync, [focusId]);
  useEffect(function () {
    if (!contextValue) {
      return;
    }

    checkForSync();
    var unsubscribe = contextValue.store.subscribe(checkForSync);
    return function () {
      unsubscribe();
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return focusNode;
}

function useFocusNode(nodeId) {
  useEffect(function () {
    process.env.NODE_ENV !== "production" ? warning("You used the hook `useFocusNode`. This hook has been renamed to `useFocusNodeById`. Please refactor your code to use the new hook instead.", 'USE_FOCUS_NODE_RENAMED') : void 0;
  }, []);
  return useFocusNodeById(nodeId);
}

function hierarchiesAreEqual(old, current) {
  if (old === void 0) {
    old = [];
  }

  if (current === void 0) {
    current = [];
  }

  // Hierarchies are only equal when the lengths are the same, and...
  if (old.length !== current.length) {
    return false;
  }

  var oldFocusedExact = old[old.length - 1] || {}; // ...when the last IDs match

  if (oldFocusedExact.focusId !== current[current.length - 1]) {
    return false;
  }

  return true;
}

function useFocusHierarchy() {
  var contextValue = useContext(FocusContext$1.Context);

  var _useState = useState(function () {
    if (!contextValue) {
      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== "production" ? warning('A FocusProvider was not found in the tree. Did you forget to mount it?', 'NO_FOCUS_PROVIDER_DETECTED') : void 0;
      }

      return [];
    } else {
      var focusState = contextValue.store.getState();
      return focusState.focusHierarchy.map(function (nodeId) {
        return focusState.nodes[nodeId];
      });
    }
  }),
      focusHierarchy = _useState[0],
      setFocusHierarchy = _useState[1];

  var focusHierarchyRef = useRef(focusHierarchy);
  focusHierarchyRef.current = focusHierarchy;

  function checkForSync() {
    if (!contextValue) {
      return;
    }

    var currentState = contextValue.store.getState();
    var currentHierarchy = contextValue.store.getState().focusHierarchy;

    if (!hierarchiesAreEqual(focusHierarchyRef.current, currentHierarchy)) {
      setFocusHierarchy(currentState.focusHierarchy.map(function (nodeId) {
        return currentState.nodes[nodeId];
      }));
    }
  }

  useEffect(function () {
    if (!contextValue) {
      return;
    }

    checkForSync();
    var unsubscribe = contextValue.store.subscribe(checkForSync);
    return function () {
      unsubscribe();
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return focusHierarchy;
}

function useLeafFocusedNode() {
  var focusHierarchy = useFocusHierarchy();
  var leafId = useMemo(function () {
    var _focusHierarchy;

    return focusHierarchy == null ? void 0 : (_focusHierarchy = focusHierarchy[focusHierarchy.length - 1]) == null ? void 0 : _focusHierarchy.focusId;
  }, [focusHierarchy]);
  var leafFocusedNode = useFocusNodeById(leafId != null ? leafId : '');
  return leafFocusedNode;
}

function useActiveNode() {
  var contextValue = useContext(FocusContext$1.Context);

  var _useState = useState(function () {
    if (!contextValue) {
      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== "production" ? warning('A FocusProvider was not found in the tree. Did you forget to mount it?', 'NO_FOCUS_PROVIDER_DETECTED') : void 0;
      }

      return null;
    } else {
      var focusState = contextValue.store.getState();

      if (focusState.activeNodeId === null) {
        return null;
      }

      var possibleNode = focusState.nodes[focusState.activeNodeId];
      return possibleNode != null ? possibleNode : null;
    }
  }),
      focusNode = _useState[0],
      setFocusNode = _useState[1];

  var focusNodeRef = useRef(focusNode);
  focusNodeRef.current = focusNode;

  function checkForSync() {
    var _currentState$nodes$c;

    if (!contextValue) {
      return;
    }

    var currentState = contextValue.store.getState();

    if (!currentState.activeNodeId) {
      setFocusNode(null);
      return;
    }

    var currentNode = (_currentState$nodes$c = currentState.nodes[currentState.activeNodeId]) != null ? _currentState$nodes$c : null;

    if (currentNode !== focusNodeRef.current) {
      setFocusNode(currentNode);
    }
  }

  useEffect(function () {
    if (!contextValue) {
      return;
    }

    checkForSync();
    var unsubscribe = contextValue.store.subscribe(checkForSync);
    return function () {
      unsubscribe();
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return focusNode;
}

function useFocusStoreDangerously() {
  var contextValue = useContext(FocusContext$1.Context);

  if (!contextValue) {
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== "production" ? warning('A FocusProvider was not found in the tree. Did you forget to mount it?', 'NO_FOCUS_PROVIDER_DETECTED') : void 0;
    }

    throw new Error('No FocusProvider.');
  } // @ts-ignore


  return contextValue.store;
}

function useSetFocus() {
  var contextValue = useContext(FocusContext$1.Context);

  if (!contextValue) {
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== "production" ? warning('A FocusProvider was not found in the tree. Did you forget to mount it?', 'NO_FOCUS_PROVIDER_DETECTED') : void 0;
    }

    throw new Error('No FocusProvider.');
  } // @ts-ignore


  return contextValue.store.setFocus;
}

var isEqual = function isEqual(a, b) {
  return a === b;
};

function useChange(val, callback, comparator) {
  if (comparator === void 0) {
    comparator = isEqual;
  }

  var previous = usePrevious(val);
  useEffect(function () {
    if (typeof callback === 'function' && typeof comparator === 'function') {
      if (!comparator(val, previous)) {
        callback(val, previous);
      }
    }
  }, [val, previous, comparator, callback]);
}

function useFocusEvents(nodeId, events) {
  if (events === void 0) {
    events = {};
  }

  var _useState = useState(nodeId),
      constantNodeId = _useState[0];

  var node = useFocusNodeById(constantNodeId);
  var nodeRef = useRef(node);
  nodeRef.current = node;
  var eventsRef = useRef(events);
  eventsRef.current = events; // This pattern allows the `focus` hook to be called even on mount.
  // When the node doesn't exist, we set this to false. Then, when the initial
  // mounting is done, `node.isFocused` is true, and the callbacks fire.

  var isFocused = Boolean(node && node.isFocused); // This ensures that the enabled/disabled hooks are *not* called on mount.
  // This way, `disabled/enabled` are only called when that state actually changes

  var isDisabled;

  if (!node) {
    isDisabled = null;
  } else {
    isDisabled = node.disabled;
  } // For active, we also wouldn't want it to be called on mount, but it's not possible
  // for a node to be mounted as active, so this simpler logic gives us the desired behavior.


  var isActive = Boolean(node && node.active);
  useChange(nodeId, function (currentId, prevId) {
    if (typeof prevId !== 'string') {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (currentId !== prevId) {
        process.env.NODE_ENV !== "production" ? warning("The nodeId passed into useFocusEvents changed. This change has been ignored: the nodeId cannot be changed.", 'FOCUS_EVENTS_NODE_ID_CHANGED') : void 0;
      }
    }
  });
  useChange(isFocused, function (currentIsFocused) {
    if (nodeRef.current) {
      if (currentIsFocused && typeof eventsRef.current.focus === 'function') {
        eventsRef.current.focus(nodeRef.current);
      } else if (!currentIsFocused && typeof eventsRef.current.blur === 'function') {
        eventsRef.current.blur(nodeRef.current);
      }
    }
  });
  useChange(isDisabled, function (currentIsDisabled, prevIsDisabled) {
    if (prevIsDisabled === undefined || prevIsDisabled == null) {
      return;
    }

    if (nodeRef.current) {
      if (currentIsDisabled && typeof eventsRef.current.disabled === 'function') {
        eventsRef.current.disabled(nodeRef.current);
      } else if (!currentIsDisabled && typeof eventsRef.current.enabled === 'function') {
        eventsRef.current.enabled(nodeRef.current);
      }
    }
  });
  useChange(isActive, function (currentIsActive) {
    if (nodeRef.current) {
      if (currentIsActive && typeof eventsRef.current.active === 'function') {
        eventsRef.current.active(nodeRef.current);
      } else if (!currentIsActive && typeof eventsRef.current.inactive === 'function') {
        eventsRef.current.inactive(nodeRef.current);
      }
    }
  });
}

function useProcessKey() {
  var focusStore = useFocusStoreDangerously();
  return focusStore.processKey;
}

var FocusRoot$1 = FocusContext$1.FocusRoot;

export { ForwardedFocusNode as FocusNode, FocusRoot$1 as FocusRoot, useActiveNode, useFocusEvents, useFocusHierarchy, useFocusNode, useFocusNodeById, useFocusStoreDangerously, useLeafFocusedNode, useProcessKey, useSetFocus };
//# sourceMappingURL=lrud.esm.js.map
