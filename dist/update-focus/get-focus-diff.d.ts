import { NodeHierarchy } from '../types';
interface GetFocusDiffOptions {
    focusHierarchy: NodeHierarchy;
    prevFocusHierarchy: NodeHierarchy;
}
interface FocusDiff {
    blur: NodeHierarchy;
    focus: NodeHierarchy;
    unchanged: NodeHierarchy;
}
export default function getFocusDiff({ focusHierarchy, prevFocusHierarchy, }: GetFocusDiffOptions): FocusDiff;
export {};
