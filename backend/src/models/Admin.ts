import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IAdmin, IAdminMethods, AdminModel } from "../types/models";

const adminSchema = new Schema<IAdmin, AdminModel, IAdminMethods>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose method to compare passwords
adminSchema.method("comparePassword", async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
});

export const Admin = model<IAdmin, AdminModel>("Admin", adminSchema);
export default Admin;
