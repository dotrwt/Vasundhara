import { Schema, model } from "mongoose";
import { IDmrAc } from "../types/models";

const dmrAcSchema = new Schema<IDmrAc>(
  {
    farmerName: {
      type: String,
      required: [true, "Farmer / Beneficiary name is required"],
      trim: true,
    },
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    kharifCash: {
      type: Number,
      required: [true, "Kharif Cash limit is required"],
      min: [0, "Kharif Cash limit cannot be negative"],
      default: 0,
    },
    kharifKind: {
      type: Number,
      required: [true, "Kharif Kind limit is required"],
      min: [0, "Kharif Kind limit cannot be negative"],
      default: 0,
    },
    rabiCash: {
      type: Number,
      required: [true, "Rabi Cash limit is required"],
      min: [0, "Rabi Cash limit cannot be negative"],
      default: 0,
    },
    rabiKind: {
      type: Number,
      required: [true, "Rabi Kind limit is required"],
      min: [0, "Rabi Kind limit cannot be negative"],
      default: 0,
    },
    remarks: {
      type: String,
      trim: true,
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

// Search index on farmerName and remarks
dmrAcSchema.index({ farmerName: "text", remarks: "text" });

export const DmrAc = model<IDmrAc>("DmrAc", dmrAcSchema);
export default DmrAc;
