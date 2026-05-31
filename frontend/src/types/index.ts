export interface Admin {
  id: string;
  name: string;
  email: string;
}

export interface LandRecord {
  surveyNumber: string;
  rakhva: number;
}

export interface User {
  id: string;
  _id?: string; // MongoDB format
  name: string;
  fatherName: string;
  mobile: string;
  aadhar: string;
  pan: string;
  panFile?: string;
  farmerId: string;
  samagraId?: string;
  gender?: string;
  farmerCategory?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  jila: string;
  tehsil: string;
  gao: string;
  landRecords: LandRecord[];
  totalRakhva: number;
  createdBy: Admin | string;
  updatedBy?: Admin | string;
  createdAt: string;
  updatedAt: string;
}

export interface DmrAc {
  id: string;
  _id?: string;
  farmerName: string;
  farmerId?: User | string;
  kharifCash: number;
  kharifKind: number;
  rabiCash: number;
  rabiKind: number;
  remarks?: string;
  createdBy: Admin | string;
  updatedBy?: Admin | string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
}
