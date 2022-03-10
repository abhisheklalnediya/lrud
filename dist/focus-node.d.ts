import React from 'react';
import { FocusNodeProps, ReactNodeRef } from './types';
export declare function FocusNode({ elementType, focusId, className, children, wrapping, wrapGridHorizontal, wrapGridVertical, orientation, isGrid, isTrap, forgetTrapFocusHierarchy, defaultFocusColumn, defaultFocusRow, disabled, onMountAssignFocusTo, defaultFocusChild, isExiting, propsFromNode, focusedClass, focusedLeafClass, disabledClass, activeClass, onKey, onArrow, onLeft, onRight, onUp, onDown, onSelected, onBack, onMove, onGridMove, onFocused, onBlurred, onClick, onMouseOver, ...otherProps }: FocusNodeProps, ref: ReactNodeRef): JSX.Element;
declare const ForwardedFocusNode: React.ForwardRefExoticComponent<FocusNodeProps & React.RefAttributes<HTMLElement>>;
export default ForwardedFocusNode;
