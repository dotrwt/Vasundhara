import { Router } from "express";
import { body } from "express-validator";
import { protect } from "../middleware/auth";
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  exportUsersToExcel,
} from "../controllers/userController";

const router = Router();

// Protect all routes under /api/users
router.use(protect);

// Export route needs to be defined BEFORE /:id so it doesn't get treated as an ID parameter
router.get("/export/excel", exportUsersToExcel);

// User validation chain
const userValidationRules = [
  body("name", "Name is required").notEmpty().trim(),
  body("fatherName", "Father name is required").notEmpty().trim(),
  body("mobile", "Mobile number must be exactly 10 digits").matches(/^\d{10}$/),
  body("aadhar", "Aadhar number must be exactly 12 digits").matches(/^\d{12}$/),
  body("pan", "PAN must be a valid format (e.g., ABCDE1234F)")
    .toUpperCase()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
  body("jila", "Jila is required").notEmpty().trim(),
  body("tehsil", "Tehsil is required").notEmpty().trim(),
  body("gao", "Village name (Gao) is required").notEmpty().trim(),
  body("landRecords")
    .isArray({ min: 1 })
    .withMessage("At least one land record is required"),
  body("landRecords.*.surveyNumber", "Survey number is required")
    .notEmpty()
    .trim(),
  body("landRecords.*.rakhva", "Rakhva must be a number greater than 0").isFloat({
    gt: 0,
  }),
];

router.get("/", getUsers);
router.post("/", userValidationRules, createUser);
router.get("/:id", getUserById);
router.put("/:id", userValidationRules, updateUser);
router.delete("/:id", deleteUser);

export default router;
