export const formatStatusAction = (
    action?: string,
    oldValue?: string,
    newValue?: string
) => {
    // Preferred: use oldValue → newValue if available
    if (oldValue && newValue) {
        return `Status changed from ${oldValue} to ${newValue}`;
    }

    // Fallback: parse action text
    if (!action) return "Status updated";

    // Handle arrows: "To Do → In Progress"
    if (action.includes("→")) {
        const [from, to] = action.split("→").map(s => s.trim());
        return `Status changed from ${from} to ${to}`;
    }

    // Handle constants like STATUS_CHANGE
    if (action === "STATUS_CHANGE") {
        return "Status updated";
    }

    return action.replace(/_/g, " ").toLowerCase();
};


export const formatActionSimple = (action?: string) => {
    if (!action) return "";

    return action
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};