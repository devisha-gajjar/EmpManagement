import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { openSnackbar } from "../features/shared/snackbarSlice";

export const useAppDispatch = () => useDispatch<AppDispatch>(); // define which type of action can be dispatched 
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // same for the selector

//#region SnackBar
export const useSnackbar = () => {
    const dispatch = useDispatch();

    const toast = {
        success: (message: string) => dispatch(openSnackbar({ message, type: 'success' })),
        error: (message: string) => dispatch(openSnackbar({ message, type: 'error' })),
        info: (message: string) => dispatch(openSnackbar({ message, type: 'info' })),
        warning: (message: string) => dispatch(openSnackbar({ message, type: 'warning' })),
    };

    return toast;
};
//#endregion