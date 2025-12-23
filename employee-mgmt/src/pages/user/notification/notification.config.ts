import type { TagInputConfig } from "../../../interfaces/tag.interface";

export const getNotificationTag = (type: string): TagInputConfig => {
    switch (type) {
        case "ProjectAssigned":
            return {
                id: type,
                label: "Assigned",
                type: "static",
                backgroundColor: "light-green",
                textColor: "green",
                hasBorder: false,
                isSelected: false
            };

        case "RoleUpdated":
            return {
                id: type,
                label: "Updated",
                type: "static",
                backgroundColor: "light-yellow",
                textColor: "yellow",
                hasBorder: false,
                isSelected: false
            };

        default:
            return {
                id: type,
                label: "Info",
                type: "static",
                backgroundColor: "light-white",
                textColor: "black",
                hasBorder: false,
                isSelected: false
            };
    }
};
