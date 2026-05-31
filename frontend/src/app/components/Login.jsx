import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "@/lib/auth";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 border border-gray-300">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          User Management System
        </h1>
        <h2 className="text-lg font-semibold mb-6 text-gray-700">Login</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-base mb-2 block">
              Email / Username
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-base"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-base mb-2 block">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 text-base"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 border border-red-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-gray-600 text-center">
          First time? <button onClick={() => navigate("/signup")} className="text-blue-600 hover:underline font-semibold">Create admin account</button>
        </div>
      </div>
    </div>
  );
}
