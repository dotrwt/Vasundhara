import { Schema, model } from "mongoose";
import { IUser } from "../types/models";

const landRecordSchema = new Schema({
  surveyNumber: {
    type: String,
    required: [true, "Survey number is required"],
    trim: true,
  },
  rakhva: {
    type: Number,
    required: [true, "Rakhva is required"],
    min: [0.0001, "Rakhva must be greater than 0"],
  },
});

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      validate: {
        validator: function (v: string) {
          return /^\d{10}$/.test(v);
        },
        message: "Mobile number must be exactly 10 digits",
      },
    },
    aadhar: {
      type: String,
      required: [true, "Aadhar number is required"],
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^\d{12}$/.test(v);
        },
        message: "Aadhar number must be exactly 12 digits",
      },
    },
    pan: {
      type: String,
      required: [true, "PAN number is required"],
      uppercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
        },
        message: "Invalid PAN card format",
      },
    },
    samagraId: {
      type: String,
      required: false,
      validate: {
        validator: function (v: string) {
          return !v || /^\d{9}$/.test(v);
        },
        message: "Samagra ID must be exactly 9 digits",
      },
      trim: true,
    },
    kharifCashAccount: {
      type: String,
      required: false,
      validate: {
        validator: function (v: string) {
          return !v || /^\d{9,18}$/.test(v);
        },
        message: "Kharif Cash Account must be between 9 and 18 digits",
      },
      trim: true,
    },
    kharifKindAccount: {
      type: String,
      required: false,
      validate: {
        validator: function (v: string) {
          return !v || /^\d{9,18}$/.test(v);
        },
        message: "Kharif Kind Account must be between 9 and 18 digits",
      },
      trim: true,
    },
    rabiCashAccount: {
      type: String,
      required: false,
      validate: {
        validator: function (v: string) {
          return !v || /^\d{9,18}$/.test(v);
        },
        message: "Rabi Cash Account must be between 9 and 18 digits",
      },
      trim: true,
    },
    rabiKindAccount: {
      type: String,
      required: false,
      validate: {
        validator: function (v: string) {
          return !v || /^\d{9,18}$/.test(v);
        },
        message: "Rabi Kind Account must be between 9 and 18 digits",
      },
      trim: true,
    },
    jila: {
      type: String,
      required: [true, "Jila (district) is required"],
      trim: true,
    },
    tehsil: {
      type: String,
      required: [true, "Tehsil is required"],
      trim: true,
    },
    gao: {
      type: String,
      required: [true, "Gao (village) is required"],
      trim: true,
    },
    landRecords: {
      type: [landRecordSchema],
      validate: {
        validator: function (v: any) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one land record is required",
      },
    },
    totalRakhva: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Created by admin ID is required"],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate totalRakhva
userSchema.pre<IUser>("save", function (next) {
  if (this.landRecords && this.landRecords.length > 0) {
    this.totalRakhva = this.landRecords.reduce((sum, record) => {
      return sum + (record.rakhva || 0);
    }, 0);
  } else {
    this.totalRakhva = 0;
  }
  next();
});

// Text index on name, mobile, aadhar, pan, gao, samagraId
userSchema.index({
  name: "text",
  mobile: "text",
  aadhar: "text",
  pan: "text",
  gao: "text",
  samagraId: "text",
});

export const User = model<IUser>("User", userSchema);
export default User;
