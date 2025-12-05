import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
// import employeesReducer from "../features/employees/empSlice";
import snackbarReducer from "../features/shared/snackbarSlice";
import departmentReducer from "../features/department/departmentSlice";
import dashboardReducer from "../features/user/dashboard/dashboardSlice";
import leaveReducer from "../features/user/leave/leaveSlice";
import { employeeApi } from "../features/employees/empApi";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // employees: employeesReducer,
        snackbar: snackbarReducer,
        department: departmentReducer,
        dashboard: dashboardReducer,
        leaves: leaveReducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(employeeApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
