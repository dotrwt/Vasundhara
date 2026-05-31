import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

export function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0769110a/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      alert("Account created successfully! You can now login.");
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred during signup");
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
        <h2 className="text-lg font-semibold mb-6 text-gray-700">Create Admin Account</h2>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-base mb-2 block">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 text-base"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base mb-2 block">
              Email
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
              minLength={6}
              className="h-12 text-base"
              placeholder="Enter your password (min 6 characters)"
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
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline text-sm"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}
