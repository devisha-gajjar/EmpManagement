import type { SnackbarType } from "../types/type";

export interface SnackbarState {
    isOpen: boolean;
    message: string;
    type: SnackbarType;
}