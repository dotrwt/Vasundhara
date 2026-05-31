import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import Admin from "../models/Admin";

// Generate JWT Token
const generateToken = (id: string, name: string): string => {
  return jwt.sign(
    { id, name },
    process.env.JWT_SECRET || "your_super_secret_jwt_key_change_in_production",
    {
      expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any,
    }
  );
};

// @desc    Register a new admin
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((err) => err.msg).join(", "),
      });
    }

    const { name, email, password } = req.body;

    // Check if email already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(admin.id, admin.name);

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((err) => err.msg).join(", "),
      });
    }

    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare passwords
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(admin.id, admin.name);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in admin info
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
