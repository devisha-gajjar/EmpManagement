import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
// import employeesReducer from "../features/employees/empSlice";
import loaderReducer from "../features/shared/loaderSlice"
import snackbarReducer from "../features/shared/snackbarSlice";
import departmentReducer from "../features/admin/department/departmentSlice";
import dashboardReducer from "../features/user/dashboard/dashboardSlice";
import leaveReducer from "../features/user/leave/leaveSlice";
import leaveListReducer from "../features/admin/leave/leaveSlice";
import notificationReducer from "../features/user/notifications/notificationSlice";
import projectDetailsReducer from "../features/admin/project-mgmt/projectDetailSlice";
import taskWorkLogReducer from "../features/admin/project-mgmt/taskWorklogSlice";
import userWorkLogReducer from "../features/user/task/userTasksSlice";
import geoReducer from "../features/user/profile/locationSlice";
import documentReducer from "../features/user/profile/documentSlice";
import themeReducer from "../features/shared/themeSlice";
import { employeeApi } from "../features/admin/employees/empApi";
import { projectsApi } from "../features/admin/project-mgmt/projectsMgmtApi";
import { projectMembersApi } from "../features/admin/project-mgmt/projectMembersApi";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // employees: employeesReducer,
        loader: loaderReducer,
        snackbar: snackbarReducer,
        department: departmentReducer,
        dashboard: dashboardReducer,
        leaves: leaveReducer,
        leaveList: leaveListReducer,
        notification: notificationReducer,
        projectDetails: projectDetailsReducer,
        taskWorkLogs: taskWorkLogReducer,
        documents: documentReducer,
        theme: themeReducer,
        userTask: userWorkLogReducer,
        geo: geoReducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
        [projectsApi.reducerPath]: projectsApi.reducer,
        [projectMembersApi.reducerPath]: projectMembersApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(
                employeeApi.middleware,
                projectsApi.middleware,
                projectMembersApi.middleware,
            )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
