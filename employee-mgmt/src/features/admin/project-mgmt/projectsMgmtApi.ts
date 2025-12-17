import { createApi } from "@reduxjs/toolkit/query/react"; import { axiosBaseQuery } from "../../../api/axiosBaseQuery";
import type { Project } from "../../../interfaces/project.interface";
;

interface ApiResponse<T> {
  result: boolean;
  message: string;
  statusCode: number;
  data: T;
}

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Projects"],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => ({
        url: "/Projects",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Project[]>) =>
        response.data,
      providesTags: ["Projects"],
    }),

    getProjectById: builder.query<Project, number>({
      query: (id) => ({
        url: `/Projects/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Project>) =>
        response.data,
    }),

    saveProject: builder.mutation<void, any>({
      query: (body) => ({
        url: "/Projects/save",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Projects"],
    }),

    deleteProject: builder.mutation<void, number>({
      query: (id) => ({
        url: `/Projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useSaveProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
