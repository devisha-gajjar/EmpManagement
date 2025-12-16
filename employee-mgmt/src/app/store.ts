import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
// import employeesReducer from "../features/employees/empSlice";
import loaderReducer from "../features/shared/loaderSlice"
import snackbarReducer from "../features/shared/snackbarSlice";
import departmentReducer from "../features/admin/department/departmentSlice";
import dashboardReducer from "../features/user/dashboard/dashboardSlice";
import leaveReducer from "../features/user/leave/leaveSlice";
import leaveListReducer from "../features/admin/leave/leaveSlice";
import { employeeApi } from "../features/admin/employees/empApi";
import { projectsApi } from "../features/admin/project-mgmt/projectsMgmtApi";

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
        [employeeApi.reducerPath]: employeeApi.reducer,
        [projectsApi.reducerPath]: projectsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(
                employeeApi.middleware,
                projectsApi.middleware
            )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
