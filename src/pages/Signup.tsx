import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { signupSchema } from "../lib/schema";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/ui/Spinner";

type FormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const { user, authReady } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (authReady && user) {
      navigate("/", { replace: true });
    }
  }, [user, authReady, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      reset();
      navigate("/login");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Signup failed");
    }
  };

  if (!authReady || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-3">Create account</h3>
        <p className="text-sm text-gray-500 mb-4">
          Use your work email to continue
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <input
              {...register("name")}
              placeholder="Full name"
              className="w-full p-3 border rounded-md"
            />
            <div className="text-xs text-red-500 mt-1">
              {errors.name?.message}
            </div>
          </div>

          <div>
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full p-3 border rounded-md"
            />
            <div className="text-xs text-red-500 mt-1">
              {errors.email?.message}
            </div>
          </div>

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border rounded-md pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <div className="text-xs text-red-500 mt-1">
              {errors.password?.message}
            </div>
          </div>

          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full p-3 border rounded-md pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <EyeOff className="w-5 h-5 text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <div className="text-xs text-red-500 mt-1">
              {errors.confirmPassword?.message}
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
