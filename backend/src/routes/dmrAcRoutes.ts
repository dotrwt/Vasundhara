import { Router } from "express";
import { body } from "express-validator";
import { protect } from "../middleware/auth";
import {
  getDmrAccounts,
  createDmrAccount,
  getDmrAccountById,
  updateDmrAccount,
  deleteDmrAccount,
} from "../controllers/dmrAcController";

const router = Router();

// Protect all routes under /api/dmrac
router.use(protect);

// DMR AC validation chain
const dmrAcValidationRules = [
  body("farmerName", "Farmer / Beneficiary name is required").notEmpty().trim(),
  body("kharifCash", "Kharif Cash must be a number greater than or equal to 0")
    .isFloat({ min: 0 })
    .toFloat(),
  body("kharifKind", "Kharif Kind must be a number greater than or equal to 0")
    .isFloat({ min: 0 })
    .toFloat(),
  body("rabiCash", "Rabi Cash must be a number greater than or equal to 0")
    .isFloat({ min: 0 })
    .toFloat(),
  body("rabiKind", "Rabi Kind must be a number greater than or equal to 0")
    .isFloat({ min: 0 })
    .toFloat(),
  body("remarks").optional().trim(),
  body("farmerId").optional({ checkFalsy: true }).isMongoId().withMessage("Invalid Farmer Reference"),
];

router.get("/", getDmrAccounts);
router.post("/", dmrAcValidationRules, createDmrAccount);
router.get("/:id", getDmrAccountById);
router.put("/:id", dmrAcValidationRules, updateDmrAccount);
router.delete("/:id", deleteDmrAccount);

export default router;
