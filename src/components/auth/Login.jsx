import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { userLogin, queryClient } from "../../utils/htttps";
export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
  
    const mutation = useMutation({
      mutationFn: userLogin,
      onSuccess: (data) => {
        alert("Login Successful!");
        console.log("User logged in:", data);
        queryClient.invalidateQueries('login-user')
      },
      onError: (error) => {
        alert(error.message);
      },
    });
  
    const onSubmit = (formData) => {
      mutation.mutate(formData);
    };
  
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" }
              })}
              className="w-full p-2 border rounded mt-1"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
  
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-2 border rounded mt-1"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Logging In..." : "Login"}
          </button>
  
          {/* Error Message */}
          {mutation.isError && <p className="text-red-500 text-center">{mutation.error.message}</p>}
        </form>
      </div>
    );
  }
