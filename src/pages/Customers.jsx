import { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { app } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Customers() {
  const db = getFirestore(app);
  const { user } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  // Load customers for this business
  useEffect(() => {
    const loadCustomers = async () => {
      if (!user) return;

      const q = query(
        collection(db, "customers"),
        where("businessId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCustomers(list);
      setLoading(false);
    };

    loadCustomers();
  }, [user]);

  // Add new customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();

    if (!name || !address) return;

    const docRef = await addDoc(collection(db, "customers"), {
      name,
      address,
      businessId: user.uid,
      createdAt: new Date(),
    });

    setCustomers([...customers, { id: docRef.id, name, address }]);
    setName("");
    setAddress("");
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Customers</h1>

      {/* Add Customer Form */}
      <form
        onSubmit={handleAddCustomer}
        className="bg-slate-800 p-6 rounded-lg shadow mb-8 max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>

        <input
          type="text"
          placeholder="Customer Name"
          className="w-full p-2 mb-3 rounded bg-slate-700 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Address"
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded"
        >
          Add Customer
        </button>
      </form>

      {/* Customer List */}
      <h2 className="text-2xl font-semibold mb-4">Customer List</h2>

      {loading ? (
        <p className="text-gray-400">Loading customers...</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-400">No customers yet.</p>
      ) : (
        <div className="space-y-4">
          {customers.map((c) => (
            <div
              key={c.id}
              className="bg-slate-800 p-4 rounded-lg shadow flex justify-between"
            >
              <div>
                <p className="text-lg font-semibold">{c.name}</p>
                <p className="text-gray-400">{c.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
