import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../context/AuthContext";
import { apiLogin } from "../api/auth";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const response = await apiLogin(values);
      if (response.success && response.data) {
        const { token, admin } = response.data;
        login(token, admin);
        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        setApiError(response.message || "Login failed");
        toast.error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errMsg = error.response?.data?.message || "Invalid credentials. Please try again.";
      setApiError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
      <div className="w-full max-w-md bg-white p-8 border-2 border-gray-400 shadow-sm">
        {/* Government Emblem Header Mock */}
        <div className="text-center mb-6 border-b border-gray-300 pb-4">
          <div className="inline-block bg-gray-100 p-2 border border-gray-300 mb-2">
            <span className="font-extrabold text-sm uppercase tracking-widest text-gray-800">
              OFFICIAL SYSTEM ACCESS
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
            User Management
          </h1>
          <p className="text-xs text-gray-500 font-bold uppercase mt-1">
            Department of Land Records & Audits
          </p>
        </div>

        <h2 className="text-lg font-bold mb-6 text-gray-800 border-l-4 border-blue-600 pl-2 uppercase tracking-wide">
          Admin Portal Authentication
        </h2>

        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-400 text-red-700 text-sm font-semibold">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-base font-bold text-gray-900 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              disabled={isSubmitting}
              className={`block w-full h-12 px-3 border-2 ${
                errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-400 focus:border-blue-600 focus:ring-blue-600"
              } bg-white text-base focus:outline-none focus:ring-1`}
              placeholder="admin@example.gov.in"
              {...register("register" in errors ? "email" : "email")} // standard register hook
            />
            {errors.email && (
              <p className="text-red-600 text-sm font-bold mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-base font-bold text-gray-900 mb-2">
              Secret Password
            </label>
            <input
              id="password"
              type="password"
              disabled={isSubmitting}
              className={`block w-full h-12 px-3 border-2 ${
                errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-400 focus:border-blue-600 focus:ring-blue-600"
              } bg-white text-base focus:outline-none focus:ring-1`}
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-600 text-sm font-bold mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base uppercase tracking-wider border-2 border-blue-700 disabled:opacity-50 cursor-pointer flex items-center justify-center"
          >
            {isSubmitting ? "Authenticating Session..." : "Authorize Access"}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600 font-medium">
            New administrator?{" "}
            <button
              onClick={() => navigate("/register")}
              disabled={isSubmitting}
              className="text-blue-700 hover:underline font-bold focus:outline-none cursor-pointer"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
