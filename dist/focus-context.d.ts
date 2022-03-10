import React from 'react';
import { ProviderValue, Orientation } from './types';
declare function FocusRoot({ orientation, wrapping, children, pointerEvents, throttle }: {
    children?: React.ReactNode;
    orientation?: Orientation;
    wrapping?: boolean;
    pointerEvents?: boolean;
    throttle?: number;
}): JSX.Element;
declare const _default: {
    Context: React.Context<ProviderValue | null>;
    FocusRoot: typeof FocusRoot;
};
export default _default;
