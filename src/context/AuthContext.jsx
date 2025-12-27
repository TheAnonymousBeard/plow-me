import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // Firestore user data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Load Firestore user profile
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProfile(snap.data());
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
