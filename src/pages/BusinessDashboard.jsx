import DashboardLayout from "../layouts/DashboardLayout";

export default function BusinessDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Business Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Active Routes</h2>
          <p className="text-gray-400">0 active routes</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Customers</h2>
          <p className="text-gray-400">Manage your client list</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Plow Sessions</h2>
          <p className="text-gray-400">Start or review plow jobs</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
