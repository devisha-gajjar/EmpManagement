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
            { name: "Leaves", path: "leaves" },
        ];
    }
    return [];
};


export const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';