import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import employeesReducer from "../features/employees/empSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        employees: employeesReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
