import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Authentication() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000/api/user";

  const handleAuth = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setMessage({
      text: isLogin ? "Logging in..." : "Creating account...",
      type: "info",
    });
    setIsLoading(true);

    const endpoint = isLogin ? "/login" : "/register";
    try {
      const isGoogle = e && e.isGoogle;
      const payload = isGoogle
        ? { credential: e.credential, isGoogle: true }
        : { email, password };

      const targetRoute = isGoogle
        ? `${API_URL}/google`
        : `${API_URL}${endpoint}`;
      const res = await axios.post(targetRoute, payload);
      localStorage.setItem("token", res.data.token);
      setMessage({ text: "Success! Redirecting...", type: "success" });

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      const errorMsg =
        err.response?.data?.msg || "Something went wrong. Try again.";
      setMessage({ text: errorMsg, type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {" "}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {" "}
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-600">
          Career Guidance AI
        </h2>{" "}
        <p className="text-center text-gray-500 mb-6">
          {isLogin ? "Welcome back!" : "Create a new account"}
        </p>{" "}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm text-center font-medium ${
              message.type === "error"
                ? "bg-red-100 text-red-600"
                : message.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
            }`}
          >
            {message.text}{" "}
          </div>
        )}{" "}
        <div className="flex justify-center mb-6">
          {" "}
          <GoogleLogin
            onSuccess={(res) =>
              handleAuth({ isGoogle: true, credential: res.credential })
            }
            onError={() =>
              setMessage({ text: "Google Auth Failed", type: "error" })
            }
          />{" "}
        </div>{" "}
        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-gray-300"></div>{" "}
          <span className="flex-shrink mx-4 text-gray-400 text-sm font-semibold uppercase">
            or
          </span>
          <div className="flex-grow border-t border-gray-300"></div>{" "}
        </div>{" "}
        <form onSubmit={handleAuth} className="space-y-4">
          {" "}
          <input
            type="email"
            placeholder="Email Address"
            required
            disabled={isLoading}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
            onChange={(e) => setEmail(e.target.value)}
          />{" "}
          <input
            type="password"
            placeholder="Password"
            required
            disabled={isLoading}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md active:scale-95"
          >
            {" "}
            {isLoading ? "Processing..." : isLogin ? "Login" : "Register Now"}
             {" "}
          </button>{" "}
        </form>{" "}
        <div className="mt-6 text-center text-sm text-gray-600">
          {" "}
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage({ text: "", type: "" });
            }}
            className="ml-2 text-blue-600 font-bold hover:underline"
          >
            {isLogin ? "Register here" : "Login here"}         {" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

export default Authentication;
