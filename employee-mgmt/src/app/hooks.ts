import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { openSnackbar } from "../features/shared/snackbarSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDropDownData } from "../features/shared/dropdownApi";
import { DropDownType } from "../enums/enum";

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

//#region Debounce time
export function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
//#endregion

//#region 

export type CommandItem = {
    id: string;
    title: string;
    subtitle: string;
    keywords: string;
    action: () => void;
};

export function useGlobalCommands() {
    const navigate = useNavigate();
    const [commands, setCommands] = useState<CommandItem[]>([]);

    useEffect(() => {
        async function load() {
            const employees = await getDropDownData(DropDownType.Employee);
            const projects = await getDropDownData(DropDownType.Project);

            const employeeCommands: CommandItem[] = employees.map((e: any) => ({
                id: `emp-${e.id}`,
                title: e.name,
                subtitle: "Employee",
                keywords: e.name.toLowerCase(),
                action: () => navigate(`employees/${e.id}`)
            }));

            const projectCommands: CommandItem[] = projects.map((p: any) => ({
                id: `proj-${p.id}`,
                title: p.name,
                subtitle: "Project",
                keywords: p.name.toLowerCase(),
                action: () => navigate(`project-details/${p.id}`)
            }));

            const staticCommands: CommandItem[] = [
                {
                    id: "dashboard",
                    title: "Dashboard",
                    subtitle: "Page",
                    keywords: "dashboard home",
                    action: () => navigate("/dashboard")
                }
            ];

            setCommands([...employeeCommands, ...projectCommands, ...staticCommands]);
        }

        load();
    }, [navigate]);

    return commands;
}

//#endregion