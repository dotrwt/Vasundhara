import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import DmrAc from "../models/DmrAc";

// @desc    Get paginated DMR accounts list with search filter
// @route   GET /api/dmrac
// @access  Private
export const getDmrAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const query: any = {};
    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { farmerName: searchRegex },
        { remarks: searchRegex }
      ];
    }

    const total = await DmrAc.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const accounts = await DmrAc.find(query)
      .populate("farmerId", "name mobile aadhar pan")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: accounts,
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

// @desc    Create a DMR account
// @route   POST /api/dmrac
// @access  Private
export const createDmrAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((err) => err.msg).join(", "),
      });
    }

    const accountData = {
      ...req.body,
      createdBy: req.adminId,
    };

    // If farmerId is empty string, set it as undefined
    if (accountData.farmerId === "") {
      delete accountData.farmerId;
    }

    const account = await DmrAc.create(accountData);

    return res.status(201).json({
      success: true,
      message: "DMR Crop Loan Account created successfully",
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single DMR account details
// @route   GET /api/dmrac/:id
// @access  Private
export const getDmrAccountById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const account = await DmrAc.findById(req.params.id)
      .populate("farmerId", "name mobile aadhar pan jila tehsil gao")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "DMR Crop Loan Account not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update DMR account details
// @route   PUT /api/dmrac/:id
// @access  Private
export const updateDmrAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((err) => err.msg).join(", "),
      });
    }

    const account = await DmrAc.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "DMR Crop Loan Account not found",
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.adminId,
    };

    // If farmerId is empty string, set it as undefined or null
    if (updateData.farmerId === "") {
      updateData.farmerId = null;
    }

    Object.assign(account, updateData);
    await account.save();

    return res.status(200).json({
      success: true,
      message: "DMR Crop Loan Account updated successfully",
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete DMR account
// @route   DELETE /api/dmrac/:id
// @access  Private
export const deleteDmrAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const account = await DmrAc.findById(req.params.id);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "DMR Crop Loan Account not found",
      });
    }

    await DmrAc.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "DMR Crop Loan Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
