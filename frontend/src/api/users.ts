import axiosInstance from "./axios";
import { User, ApiSuccessResponse, ApiPaginatedResponse } from "../types";

export const apiGetUsers = async (page: number, limit: number, search: string) => {
  const response = await axiosInstance.get<ApiPaginatedResponse<User>>("/users", {
    params: { page, limit, search },
  });
  return response.data;
};

export const apiCreateUser = async (data: any) => {
  const response = await axiosInstance.post<ApiSuccessResponse<User>>("/users", data);
  return response.data;
};

export const apiGetUserById = async (id: string) => {
  const response = await axiosInstance.get<ApiSuccessResponse<User>>(`/users/${id}`);
  return response.data;
};

export const apiUpdateUser = async (id: string, data: any) => {
  const response = await axiosInstance.put<ApiSuccessResponse<User>>(`/users/${id}`, data);
  return response.data;
};

export const apiDeleteUser = async (id: string) => {
  const response = await axiosInstance.delete<ApiSuccessResponse<void>>(`/users/${id}`);
  return response.data;
};

export const apiExportUsersExcel = async () => {
  const response = await axiosInstance.get("/users/export/excel", {
    responseType: "blob",
  });
  return response.data;
};
