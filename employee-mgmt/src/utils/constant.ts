export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\d{10}$/;

export const TEMP_TOKEN_KEY = "temp_token";
export const ACCESS_TOKEN_KEY = "access_token";

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
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: "bi bi-grid-fill",
      },
      {
        name: "Employees",
        path: "/admin/employees",
        icon: "bi bi-people-fill",
        subMenu: [
          {
            icon: "bi bi-person-lines-fill",
            name: "All Employees",
            path: "/admin/employees",
          }
        ],
      },
      {
        name: "Departments",
        path: "/admin/departments",
        icon: "bi bi-building-fill",
      },
      {
        name: "Attendance",
        path: "/admin/attendance",
        icon: "bi bi-calendar-check-fill",
      },
      {
        name: "Leaves",
        path: "/admin/leavesList",
        icon: "bi bi-calendar-x-fill",
      },
      {
        name: "Projects",
        path: "/admin/projects",
        icon: "bi bi-file-earmark-bar-graph-fill",
      },
      {
        name: "Settings",
        path: "/admin/settings",
        icon: "bi bi-gear-fill",
      },
    ];
  }

  if (role === "user") {
    return [
      {
        name: "Dashboard",
        path: "/user/dashboard",
        icon: "bi bi-grid-fill",
      },
      {
        name: "My Profile",
        path: "/user/profile",
        icon: "bi bi-person-circle",
      },
      {
        name: "Leaves",
        path: "/user/leaves",
        icon: "bi bi-calendar-x-fill",
        subMenu: [
          {
            name: "My Leaves",
            path: "/user/leaves",
            icon: "bi bi-list-ul",
          },
        ],
      },
      {
        name: "Attendance",
        path: "/user/attendance",
        icon: "bi bi-calendar-check-fill",
      },
      {
        name: "Notifications",
        path: "/user/notification",
        icon: "bi bi-bell-fill",
      },
      {
        name: "Tasks",
        path: "/user/tasks",
        icon: "bi bi-check2-square",
      },
    ];
  }

  return [];
};

export const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

export const userIdClaimKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

export const userNameClaimKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname';

export const sidebarCollapseWidth = 70;

export const taskStatusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Dev Completed", value: "Dev Completed" },
  { label: "Ready for Testing", value: "Ready for Testing" },
  { label: "Completed", value: "Completed" },
];
