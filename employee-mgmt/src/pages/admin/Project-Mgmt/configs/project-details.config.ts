import type { CardInputConfig } from "../../../../components/shared/card/Card";
import type { Project } from "../../../../interfaces/project.interface";
import type { TagInputConfig } from "../../../../interfaces/tag.interface";
import { formatDate } from "../../../../utils/dateUtil";

export const priorityTagConfig = (priority: string): TagInputConfig => {
    switch (priority) {
        case "High":
            return {
                id: priority,
                label: "High",
                type: "static",
                isSelected: false,
                hasBorder: false,
                backgroundColor: "light-red",
                textColor: "red",
            };
        case "Medium":
            return {
                id: priority,
                label: "Medium",
                type: "static",
                isSelected: false,
                hasBorder: false,
                backgroundColor: "light-orange",
                textColor: "orange",
            };
        default:
            return {
                id: priority,
                label: "Low",
                type: "static",
                isSelected: false,
                hasBorder: false,
                backgroundColor: "light-purple",
                textColor: "purple",
            };
    }
};

export const statusTagConfig = (status: string): TagInputConfig => ({
    id: status,
    label: status,
    type: "static",
    isSelected: false,
    hasBorder: false,
    backgroundColor: "light-blue",
    textColor: "blue",
});

export const getProjectDetailsCardConfigs = (
    project: Project,
    completedCount: number,
    totalTasks: number,
    progressPercent: number
) => {
    const timelineCardConfig: CardInputConfig = {
        title: "Timeline",
        value: `${formatDate(project.startDate)} – ${formatDate(
            project.endDate
        )}`,
        icon: "calendar-event",
    };

    const tasksCardConfig: CardInputConfig = {
        title: "Tasks",
        value: `${completedCount}/${totalTasks}`,
        subtitle: "Completed",
        icon: "check-circle",
    };  

    const progressCardConfig: CardInputConfig = {
        title: "Progress",
        value: `${progressPercent}%`,
        subtitle: "Overall completion",
        icon: "bar-chart",
    };

    return {
        timelineCardConfig,
        tasksCardConfig,
        progressCardConfig,
    };
};