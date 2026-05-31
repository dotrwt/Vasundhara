import { Router } from "express";
import { body } from "express-validator";
import { register, login, getMe } from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = Router();

// Register route
router.post(
  "/register",
  [
    body("name", "Name is required").notEmpty().trim(),
    body("email", "Please include a valid email").isEmail().normalizeEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  register
);

// Login route
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail().normalizeEmail(),
    body("password", "Password is required").exists(),
  ],
  login
);

// Current user profile route
router.get("/me", protect, getMe);

export default router;
