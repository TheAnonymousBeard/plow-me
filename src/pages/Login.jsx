import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase/config";

export default function Login() {
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/business-dashboard";
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleLogin}
        className="bg-slate-800 p-8 rounded-lg shadow-lg w-80"
      >
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          Plow Me Login
        </h1>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded bg-slate-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>
        <p className="text-gray-400 text-sm text-center mt-4">
          New user?{" "}
            <a href="/signup" className="text-blue-400 hover:underline">
              Create an account
            </a>
        </p>
      </form>
    </div>
  );
}