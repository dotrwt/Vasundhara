import dotenv from "dotenv";
// Load environment variables first
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS Configuration
const allowedOrigins = [
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : []),
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin matches allowed list, or ends with vercel.app in production/staging for preview domains,
      // or if NODE_ENV is development
      const isAllowed = allowedOrigins.some(o => o.trim().toLowerCase() === origin.toLowerCase()) ||
                        origin.endsWith(".vercel.app") ||
                        origin.endsWith(".render.com") ||
                        process.env.NODE_ENV === "development";
                        
      if (isAllowed) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests in development
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Basic health check route
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

// 404 route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// Error handling middleware (should be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
