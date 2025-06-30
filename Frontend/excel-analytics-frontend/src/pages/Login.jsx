import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AuthBox from "../components/Authbox"

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `/api/auth/login`,
        data,
        { withCredentials: true }
      );
      if (res.data.success) navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError("root", { message: msg });
    }
  };

  return (
    <AuthBox activeTab="login">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            {...register("email")}
            placeholder="Enter your email"
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="Enter your password"
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="text-right text-xs">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot password?
          </Link>
        </div>

        {errors.root && <p className="text-red-500 text-xs text-center">{errors.root.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 text-white rounded-md font-semibold text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-md transition disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
        </p>
      </form>
    </AuthBox>
  )
}

export default Login
