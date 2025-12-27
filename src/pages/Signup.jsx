import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebase/config";

export default function SignUp() {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("business"); // default role
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Create the Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Save user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        role,
        createdAt: new Date(),
      });

      // Redirect based on role
      if (role === "business") {
        window.location.href = "/business-dashboard";
      } else {
        window.location.href = "/client-dashboard";
      }
    } catch (err) {
      console.error(err);
      setError("Unable to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSignUp}
        className="bg-slate-800 p-8 rounded-lg shadow-lg w-80"
      >
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          Create Account
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
          placeholder="Password (min 6 chars)"
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Role Selector */}
        <select
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="business">Business Account</option>
          <option value="client">Client Account</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
