"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = admin ? "/api/admin/signin" : "/api/signin";
      const { data } = await axios.post(endpoint, formData); 

      localStorage.setItem("token", data.token);
      router.push(admin ? "/admin/dashboard" : "/");
    } catch (error) {
      setError("Invalid credentials");
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white shadow-lg rounded-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          {admin ? "Admin Sign In" : "User Sign In"}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Sign In
        </button>

        <div className="mt-4 text-center">
          <p
            className={`cursor-pointer text-sm ${
              admin ? "text-red-500" : "text-blue-500"
            } hover:underline`}
            onClick={() => setAdmin(!admin)}
          >
            {admin ? "Switch to User Sign In" : "Sign In as Admin"}
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            href={'/sign-up'}
            className={`cursor-pointer text-sm ${
              admin ? "text-red-500" : "text-blue-500"
            } hover:underline`}
            
          >
            New to App ? Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
