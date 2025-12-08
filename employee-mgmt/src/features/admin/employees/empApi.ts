// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axiosClient from "../../api/axiosClient";

// export const fetchEmployees = createAsyncThunk(
//     "employees/fetch",
//     async () => {
//         const res = await axiosClient.get("/employee");
//         return res.data;
//     }
// );

// export const addEmployee = createAsyncThunk(
//     "employees/add",
//     async (employeeData: any, { rejectWithValue }) => {
//         try {
//             const response = await axiosClient.post("/employee/", employeeData);
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data);
//         }
//     }
// );

// export const getEmployee = createAsyncThunk(
//     "employees/get",
//     async (id: number, { rejectWithValue }) => {
//         try {
//             const response = await axiosClient.get(`/employee/${id}`)
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data);
//         }
//     }
// )

// export const updateEmployee = createAsyncThunk(
//     "employees/update",
//     async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
//         try {
//             const response = await axiosClient.put(`/employee/${id}`, data);
//             if (response)
//                 return { ...data, id };
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data);
//         }
//     }
// );

// export const deleteEmployee = createAsyncThunk(
//     "employee/delete",
//     async (id: number, { rejectWithValue }) => {
//         try {
//             const response = await axiosClient.delete(`/employee/${id}`);
//             return response.data;
//         }
//         catch (err: any) {
//             return rejectWithValue(err.response?.data);
//         }
//     }
// )


import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../api/axiosBaseQuery";
import type { Employee } from "../../../interfaces/employee.interface";

export const employeeApi = createApi({
    reducerPath: "employeeApi",
    baseQuery: axiosBaseQuery({ baseUrl: "/employee" }),
    tagTypes: ["Employee"],

    endpoints: (builder) => ({
        // GET all employees
        getEmployees: builder.query<Employee[], void>({
            query: () => ({ url: "", method: "GET" }),
            providesTags: ["Employee"],
        }),

        // GET single employee by ID
        getEmployee: builder.query<Employee, number>({
            query: (id) => ({ url: `/${id}`, method: "GET" }),
            providesTags: (result, error, id) => [{ type: "Employee", id }],
        }),

        // POST add employee
        addEmployee: builder.mutation<Employee, Partial<Employee>>({
            query: (body) => ({ url: "", method: "POST", data: body }),
            invalidatesTags: ["Employee"], // refresh list
        }),

        // PUT update employee
        updateEmployee: builder.mutation<Employee, { id: number; data: Partial<Employee> }>({
            query: ({ id, data }) => ({ url: `/${id}`, method: "PUT", data }),
            invalidatesTags: (result, error, { id }) => [{ type: "Employee", id }, "Employee"], // refresh single & list
        }),

        // DELETE employee
        deleteEmployee: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({ url: `/${id}`, method: "DELETE" }),
            invalidatesTags: ["Employee"], // refresh list
        }),
    }),
});

export const {
    useGetEmployeesQuery,
    useGetEmployeeQuery,
    useAddEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
} = employeeApi;
