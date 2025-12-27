import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { app } from "../firebase/config";

export default function ProtectedRoute({ children }) {
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}