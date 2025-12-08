export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\d{10}$/;

export const getNavLinksByRole = (role: string) => {
    if (!role) return [];

    role = role.toLowerCase();

    if (role === "admin") {
        return [
            { name: "Employees", path: "employees" },
            { name: "Departments", path: "departments" },
        ];
    }

    if (role === "user") {
        return [
            { name: "Dashboard", path: "dashboard" },
            { name: "Leaves", path: "leaves" },
        ];
    }
    return [];
};

export const getSideBarLinksByRole = (role: string) => {
    if (!role) return [];

    role = role.toLowerCase();

    if (role === "admin") {
        return [
            {
                name: "Employees",
                path: "employees",
                subMenu: [
                    { name: "All Employees", path: "employees" },
                ],
            },
            { name: "Departments", path: "departments" },
            { name: "Leaves", path: "leavesList" },
        ];
    }

    if (role === "user") {
        return [
            { name: "Dashboard", path: "dashboard" },
            {
                name: "Leaves",
                path: "leaves",
                subMenu: [
                    { name: "My Leaves", path: "leaves" },
                ],
            },
        ];
    }
    return [];
};

export const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

export const userIdClaimKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';