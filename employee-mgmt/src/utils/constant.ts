export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\d{10}$/;

export const getNavLinksByRole = (role: string) => {
    if (!role) return [];

    role = role.toLowerCase();

    if (role === "admin") {
        return [
            { name: "Employees", path: "/employees" },
            { name: "Departments", path: "/departments" },
            { name: "Reports", path: "/reports" },
        ];
    }

    if (role === "manager") {
        return [
            { name: "Employees", path: "/employees" },
            { name: "Reports", path: "/reports" },
        ];
    }

    if (role === "employee") {
        return [
            { name: "Profile", path: "/profile" },
            { name: "Attendance", path: "/attendance" },
        ];
    }

    return [];
};


export const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';