import { Document, Model, Types } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type AdminModel = Model<IAdmin, {}, IAdminMethods>;

export interface ILandRecord {
  surveyNumber: string;
  rakhva: number;
}

export interface IUser extends Document {
  name: string;
  fatherName: string;
  mobile: string;
  aadhar: string;
  pan: string;
  samagraId?: string;
  gender?: string;
  farmerCategory?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  jila: string;
  tehsil: string;
  gao: string;
  landRecords: ILandRecord[];
  totalRakhva: number;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDmrAc extends Document {
  farmerName: string;
  farmerId?: Types.ObjectId;
  kharifCash: number;
  kharifKind: number;
  rabiCash: number;
  rabiKind: number;
  remarks?: string;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

