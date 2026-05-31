import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import XLSX from "xlsx";
import User from "../models/User";

// @desc    Get paginated users list with search filter
// @route   GET /api/users
// @access  Private
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const query: any = {};
    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { mobile: searchRegex },
        { aadhar: searchRegex },
        { pan: searchRegex },
        { gao: searchRegex },
        { samagraId: searchRegex },
      ];
    }

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const users = await User.find(query)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Private
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((err) => err.msg).join(", "),
      });
    }

    const userData = {
      ...req.body,
      createdBy: req.adminId,
    };

    const user = await User.create(userData);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user details
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((err) => err.msg).join(", "),
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields manually to trigger the 'save' pre-hook
    const updateData = {
      ...req.body,
      updatedBy: req.adminId,
    };

    Object.assign(user, updateData);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export all users to Excel
// @route   GET /api/users/export/excel
// @access  Private
export const exportUsersToExcel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    const excelData = users.map((user) => ({
      Name: user.name,
      "Father Name": user.fatherName,
      Mobile: user.mobile,
      Aadhar: user.aadhar,
      PAN: user.pan,
      "Samagra ID": user.samagraId || "",
      Gender: user.gender || "",
      "Farmer Category": user.farmerCategory || "",
      "Bank Account No": user.bankAccountNo || "",
      "IFSC Code": user.ifscCode || "",
      Jila: user.jila,
      Tehsil: user.tehsil,
      Village: user.gao,
      "Total Rakhva": user.totalRakhva,
      "Land Records": JSON.stringify(user.landRecords),
      "Created At": user.createdAt.toISOString(),
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users List");

    // Set column widths
    const maxNameLen = Math.max(...users.map((u) => u.name.length), 10);
    const maxFatherLen = Math.max(...users.map((u) => u.fatherName.length), 15);
    worksheet["!cols"] = [
      { wch: maxNameLen + 2 },
      { wch: maxFatherLen + 2 },
      { wch: 15 }, // Mobile
      { wch: 18 }, // Aadhar
      { wch: 15 }, // PAN
      { wch: 15 }, // Samagra ID
      { wch: 10 }, // Gender
      { wch: 18 }, // Category
      { wch: 20 }, // Bank Acc
      { wch: 15 }, // IFSC
      { wch: 15 }, // Jila
      { wch: 15 }, // Tehsil
      { wch: 15 }, // Village
      { wch: 15 }, // Total Rakhva
      { wch: 40 }, // Land Records (JSON)
      { wch: 25 }, // Created At
    ];

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users_export.xlsx"
    );

    return res.status(200).send(buffer);
  } catch (error) {
    next(error);
  }
};
