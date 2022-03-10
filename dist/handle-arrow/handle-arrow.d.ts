import { FocusState, Arrow } from '../types';
interface HandleArrowOptions {
    focusState: FocusState;
    arrow: Arrow;
}
export default function handleArrow({ focusState, arrow, }: HandleArrowOptions): FocusState | null;
export {};
