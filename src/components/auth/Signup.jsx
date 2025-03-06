
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signUp, queryClient } from "../../utils/htttps";
export default function SignupForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
  
    const mutation = useMutation({
      mutationFn: signUp,
      onSuccess: (data) => {
        alert("Account Created Successfully!");
        console.log("User signed up:", data);
        queryClient.invalidateQueries('signup-user')
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
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              {...register("username", { required: "Username is required" })}
              className="w-full p-2 border rounded mt-1"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>
  
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
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
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
            {mutation.isPending ? "Signing Up..." : "Sign Up"}
          </button>
  
          {/* Error Message */}
          {mutation.isError && <p className="text-red-500 text-center">{mutation.error.message}</p>}
        </form>
      </div>
    );
  }