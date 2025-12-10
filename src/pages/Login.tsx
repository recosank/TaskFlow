import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { LoginSchema } from "../lib/schema";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/ui/Spinner";

type FormData = z.infer<typeof LoginSchema>;

export default function Login() {
  const { user, authReady, login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    if (authReady && user) {
      navigate("/", { replace: true });
    }
  }, [user, authReady, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      queryClient.clear();
      navigate("/");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Login failed");
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
        <h3 className="text-lg font-semibold mb-3">Sign in</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full p-3 border rounded-md"
            />
            <div className="text-xs text-red-500">{errors.email?.message}</div>
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
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <div className="text-xs text-red-500">
              {errors.password?.message}
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
