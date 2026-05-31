import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../context/AuthContext";
import { apiLogin } from "../api/auth";
import { toast } from "sonner";
import logo from "../assets/Vasundhara_logo2.png";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 font-sans text-gray-900 dark:text-white transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl transition-colors duration-300">
        {/* Government Emblem Header Mock */}
        <div className="text-center mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
          <img src={logo} alt="Vasundhara Logo" className="h-16 mx-auto mb-3" />
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
            Vasundhara
          </h1>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase mt-1">
            Department of Land Records & Audits
          </p>
        </div>

        <h2 className="text-sm font-bold mb-6 text-gray-800 dark:text-gray-200 border-l-4 border-blue-600 pl-2 uppercase tracking-wide">
          Admin Portal Authentication
        </h2>

        {apiError && (
          <div className="mb-6 p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase rounded-md">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              disabled={isSubmitting}
              className={`block w-full h-11 px-3 border ${
                errors.email
                   ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                   : "border-gray-300 dark:border-gray-700 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500"
              } bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 rounded-md dark:text-white transition-all`}
              placeholder="admin@example.gov.in"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
              Secret Password
            </label>
            <input
              id="password"
              type="password"
              disabled={isSubmitting}
              className={`block w-full h-11 px-3 border ${
                errors.password
                   ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                   : "border-gray-300 dark:border-gray-700 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500"
              } bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 rounded-md dark:text-white transition-all`}
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-600 dark:text-red-400 text-xs font-bold mt-1 uppercase">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer flex items-center justify-center rounded-md transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99]"
          >
            {isSubmitting ? "Authenticating Session..." : "Authorize Access"}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">
            New administrator?{" "}
            <button
              onClick={() => navigate("/register")}
              disabled={isSubmitting}
              className="text-blue-600 dark:text-blue-400 hover:underline font-bold focus:outline-none cursor-pointer"
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
