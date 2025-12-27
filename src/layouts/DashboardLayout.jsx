import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { profile, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8">Plow Me</h2>

          {/* User Role Display */}
          <p className="text-gray-400 mb-6">
            Role: <span className="text-blue-400">{profile?.role}</span>
          </p>

          {/* Navigation */}
          <nav className="space-y-4">
            <Link to="/business-dashboard" className="block hover:text-blue-400">
              Dashboard
            </Link>

            <Link to="/customers" className="block hover:text-blue-400">
              Customers
            </Link>

            <Link to="/routes" className="block hover:text-blue-400">
              Routes
            </Link>

            <Link to="/sessions" className="block hover:text-blue-400">
              Plow Sessions
            </Link>

            <Link to="/history" className="block hover:text-blue-400">
              Service History
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded mt-10"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}