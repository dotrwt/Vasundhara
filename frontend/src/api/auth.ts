import axiosInstance from "./axios";
import { Admin, ApiSuccessResponse } from "../types";

export const apiRegister = async (data: any) => {
  const response = await axiosInstance.post<ApiSuccessResponse<{ token: string; admin: Admin }>>(
    "/auth/register",
    data
  );
  return response.data;
};

export const apiLogin = async (data: any) => {
  const response = await axiosInstance.post<ApiSuccessResponse<{ token: string; admin: Admin }>>(
    "/auth/login",
    data
  );
  return response.data;
};

export const apiGetMe = async () => {
  const response = await axiosInstance.get<ApiSuccessResponse<Admin>>("/auth/me");
  return response.data;
};
