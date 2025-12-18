import { ProjectRole } from "../../../../enums/enum";
import type { TagColor } from "../../../../types/type";

export const ProjectRoleConfig: Record<
    ProjectRole,
    {
        label: string;
        backgroundColor: TagColor;
        textColor: TagColor;
    }
> = {
    [ProjectRole.ProjectManager]: {
        label: "Project Manager",
        backgroundColor: "light-purple",
        textColor: "purple",
    },
    [ProjectRole.TeamLeader]: {
        label: "Team Leader",
        backgroundColor: "light-blue",
        textColor: "blue",
    },
    [ProjectRole.Developer]: {
        label: "Developer",
        backgroundColor: "light-green",
        textColor: "green",
    },
    [ProjectRole.Tester]: {
        label: "Tester",
        backgroundColor: "light-red",
        textColor: "red",
    },
    [ProjectRole.Designer]: {
        label: "Designer",
        backgroundColor: "light-yellow",
        textColor: "yellow",
    },
};