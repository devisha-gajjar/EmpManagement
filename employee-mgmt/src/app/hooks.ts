import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>(); // define which type of action can be dispatched 
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // same for the selector 
