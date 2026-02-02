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
    roles?: string[];
};

export function useGlobalCommands() {
    const navigate = useNavigate();
    const role = useAppSelector(state => state.auth.role);
    const [commands, setCommands] = useState<CommandItem[]>([]);

    useEffect(() => {
        async function load() {
            const employees = await getDropDownData(DropDownType.Employee);
            const projects = await getDropDownData(DropDownType.Project);
            console.log("role in pallete", role)
            const employeeCommands: CommandItem[] = employees.map(e => ({
                id: `emp-${e.id}`,
                title: e.name,
                subtitle: "Employee",
                keywords: e.name.toLowerCase(),
                roles: ["admin"],
                action: () => navigate(`employees/${e.id}`),
            }));

            const projectCommands: CommandItem[] = projects.map(p => ({
                id: `proj-${p.id}`,
                title: p.name,
                subtitle: "Project",
                keywords: p.name.toLowerCase(),
                roles: ["admin"],
                action: () => navigate(`project-details/${p.id}`),
            }));

            const staticCommands: CommandItem[] = [
                {
                    id: "dashboard",
                    title: "Dashboard",
                    subtitle: "Page",
                    keywords: "dashboard home",
                    roles: ["user"],
                    action: () => navigate("dashboard"),
                },
                {
                    id: "profile",
                    title: "Profile",
                    subtitle: "Page",
                    keywords: "profile document",
                    roles: ["user"],
                    action: () => navigate("profile"),
                },
                {
                    id: "leave",
                    title: "Leave List",
                    subtitle: "Page",
                    keywords: "Leave",
                    roles: ["user"],
                    action: () => navigate("leaves"),
                },
                {
                    id: "notification",
                    title: "Notification",
                    subtitle: "Page",
                    keywords: "notification notify updates",
                    roles: ["user"],
                    action: () => navigate("notification"),
                },
                {
                    id: "dashboard",
                    title: "Dashboard",
                    subtitle: "Page",
                    keywords: "dashboard home",
                    roles: ["admin"],
                    action: () => navigate("user/dashboard"),
                },
                {
                    id: "dashboard",
                    title: "Dashboard",
                    subtitle: "Page",
                    keywords: "dashboard home",
                    roles: ["admin"],
                    action: () => navigate("user/dashboard"),
                },
                {
                    id: "dashboard",
                    title: "Dashboard",
                    subtitle: "Page",
                    keywords: "dashboard home",
                    roles: ["admin"],
                    action: () => navigate("user/dashboard"),
                },
                {
                    id: "dashboard",
                    title: "Dashboard",
                    subtitle: "Page",
                    keywords: "dashboard home",
                    roles: ["admin"],
                    action: () => navigate("user/dashboard"),
                },
                {
                    id: "dashboard",
                    title: "Dashboard",
                    subtitle: "Page",
                    keywords: "dashboard home",
                    roles: ["admin"],
                    action: () => navigate("user/dashboard"),
                },
                {
                    id: "dashboard",
                    title: "Dashboard",
                    subtitle: "Page",
                    keywords: "dashboard home",
                    roles: ["admin"],
                    action: () => navigate("user/dashboard"),
                },
                {
                    id: "dashboard",
                    title: "Dashboard",
                    subtitle: "Page",
                    keywords: "dashboard home",
                    roles: ["admin"],
                    action: () => navigate("user/dashboard"),
                },
            ];

            const allCommands = [
                ...employeeCommands,
                ...projectCommands,
                ...staticCommands,
            ];

            setCommands(
                allCommands.filter(
                    cmd => !cmd.roles || cmd.roles.includes(role!)
                )
            );
        }

        if (role) load();
    }, [navigate, role]);

    return commands;
}


//#endregion