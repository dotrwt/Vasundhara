import axiosInstance from "./axios";
import { DmrAc, ApiSuccessResponse, ApiPaginatedResponse } from "../types";

export const apiGetDmrAccounts = async (page: number, limit: number, search: string) => {
  const response = await axiosInstance.get<ApiPaginatedResponse<DmrAc>>("/dmrac", {
    params: { page, limit, search },
  });
  return response.data;
};

export const apiCreateDmrAccount = async (data: any) => {
  const response = await axiosInstance.post<ApiSuccessResponse<DmrAc>>("/dmrac", data);
  return response.data;
};

export const apiGetDmrAccountById = async (id: string) => {
  const response = await axiosInstance.get<ApiSuccessResponse<DmrAc>>(`/dmrac/${id}`);
  return response.data;
};

export const apiUpdateDmrAccount = async (id: string, data: any) => {
  const response = await axiosInstance.put<ApiSuccessResponse<DmrAc>>(`/dmrac/${id}`, data);
  return response.data;
};

export const apiDeleteDmrAccount = async (id: string) => {
  const response = await axiosInstance.delete<ApiSuccessResponse<void>>(`/dmrac/${id}`);
  return response.data;
};
