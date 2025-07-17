import React from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import API from "../services/api";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters."),
});

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/auth/login", data);

      if (res.data && res.data.success) {
        if (res.data.token) { 
          localStorage.setItem("token", res.data.token);
        }
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        toast.success("Login successful! Redirecting...");
        reset();
        navigate("/dashboard");
      } else {
        toast.error(
          res.data?.message || "Login failed due to an unexpected response."
        );
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 flex-1"> 
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          Welcome Back!
        </h2>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Email Address:
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${ 
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-2">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${ 
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="••••••••"
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-red-600 text-xs mt-2">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4"> 
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg w-full sm:w-auto" 
          >
            {isSubmitting ? "Logging in..." : "Sign In"}
          </button>
          <p className="text-sm text-gray-600 text-center sm:text-right mt-4 sm:mt-0"> 
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-semibold transition duration-200 ease-in-out"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;