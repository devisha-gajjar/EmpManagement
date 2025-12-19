import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { environment } from "../../../environment/environment.dev";
import type { ApiResponse } from "../../../interfaces/apiResponse.interface";
import type { ProjectRole } from "../../../enums/enum";

export interface ProjectMember {
    projectMemberId: number;
    projectId: number;
    employeeId: number;
    name: string;
    email: string;
    role: string;
    user: any;
}

export const projectMembersApi = createApi({
    reducerPath: "projectMembersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: environment.baseUrl,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["ProjectMembers"],
    endpoints: (builder) => ({
        getMembersByProject: builder.query<ProjectMember[], number>({
            query: (projectId) =>
                `/project-members/get-members-by-project/${projectId}`,
            transformResponse: (response: ApiResponse<ProjectMember[]>) =>
                response.data,
            providesTags: ["ProjectMembers"],
        }),

        addOrUpdateMember: builder.mutation<void, { projectMemberId?: number; projectId: number; userId: number; role: ProjectRole; }>({
            query: (body) => ({
                url: "/project-members/add-or-update-member",
                method: "POST",
                body,
            }),
            invalidatesTags: ["ProjectMembers"],
        }),

        deleteMember: builder.mutation<boolean, number>({
            query: (id) => ({
                url: `/project-members/delete-member/${id}`,
                method: "DELETE",
            }),
            transformResponse: (response: ApiResponse<boolean>) =>
                response.data,
            invalidatesTags: ["ProjectMembers"],
        }),
        searchUsers: builder.query<{ value: number; label: string }[], string>({
            query: (query) => `/project-members/users/search?query=${query}`,
            transformResponse: (response: ApiResponse<any[]>) =>
                response.data.map((u) => ({
                    value: u.id,
                    label: `${u.name}`,
                })),
        }),
        getMember: builder.query<ProjectMember, number>({
            query: (projectMemberId) =>
                `/project-members/get-member/${projectMemberId}`,
            transformResponse: (response: ApiResponse<ProjectMember>) =>
                response.data,
        }),
    }),
});

export const {
    useGetMembersByProjectQuery,
    useAddOrUpdateMemberMutation,
    useDeleteMemberMutation,
    useLazySearchUsersQuery,
    useGetMemberQuery,
} = projectMembersApi;
