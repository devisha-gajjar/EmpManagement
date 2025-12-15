import { ProjectStatus } from "../../../enums/enum";
import type { Project } from "../../../interfaces/project.interface";

type ProjectStatusUIConfig = {
    label: string;
    tagColor: string;
    lightBg: string;
    icon: string;
};

export const ProjectStatusUI: Record<ProjectStatus, ProjectStatusUIConfig> = {
    [ProjectStatus.Pending]: {
        label: "Pending",
        tagColor: "yellow",
        lightBg: "light-yellow",
        icon: "clock",
    },
    [ProjectStatus.Planning]: {
        label: "Planning",
        tagColor: "blue",
        lightBg: "light-blue",
        icon: "diagram-3",
    },
    [ProjectStatus.InProgress]: {
        label: "In Progress",
        tagColor: "orange",
        lightBg: "light-orange",
        icon: "arrow-repeat",
    },
    [ProjectStatus.Completed]: {
        label: "Completed",
        tagColor: "green",
        lightBg: "light-green",
        icon: "check-circle",
    },
    [ProjectStatus.OnHold]: {
        label: "On Hold",
        tagColor: "red",
        lightBg: "light-red",
        icon: "pause-circle",
    },
};