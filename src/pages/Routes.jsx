import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { app } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

export default function RoutesPage() {
  const db = getFirestore(app);
  const { user } = useAuth();

  const [routes, setRoutes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newRouteName, setNewRouteName] = useState("");
  const [loading, setLoading] = useState(true);

  // Load routes + customers
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      // Load routes
      const routeQuery = query(
        collection(db, "routes"),
        where("businessId", "==", user.uid)
      );
      const routeSnap = await getDocs(routeQuery);
      const routeList = routeSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Load customers
      const customerQuery = query(
        collection(db, "customers"),
        where("businessId", "==", user.uid)
      );
      const customerSnap = await getDocs(customerQuery);
      const customerList = customerSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRoutes(routeList);
      setCustomers(customerList);
      setLoading(false);
    };

    loadData();
  }, [user]);

  // Create a new route
  const handleCreateRoute = async (e) => {
    e.preventDefault();
    if (!newRouteName) return;

    const docRef = await addDoc(collection(db, "routes"), {
      name: newRouteName,
      businessId: user.uid,
      customers: [],
      createdAt: new Date(),
    });

    setRoutes([...routes, { id: docRef.id, name: newRouteName, customers: [] }]);
    setNewRouteName("");
  };

  // Assign customer to a route
  const assignCustomer = async (routeId, customerId) => {
    const routeRef = doc(db, "routes", routeId);

    const updatedRoutes = routes.map((r) => {
      if (r.id === routeId) {
        const updated = {
          ...r,
          customers: [...r.customers, customerId],
        };
        updateDoc(routeRef, { customers: updated.customers });
        return updated;
      }
      return r;
    });

    setRoutes(updatedRoutes);
  };

  // Optimize route using Google Maps Directions API
  const optimizeRoute = async (route) => {
    console.log("API KEY:", import.meta.env.VITE_GOOGLE_MAPS_KEY);

    if (route.customers.length < 2) {
      alert("Add at least 2 customers to optimize a route.");
      return;
    }

    const selectedCustomers = customers.filter((c) =>
      route.customers.includes(c.id)
    );

    // Convert addresses → coordinates
    const waypoints = await Promise.all(
      selectedCustomers.map(async (c) => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          c.address
        )}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`;

        console.log("Geocode URL:", url);

        const res = await fetch(url);
        const data = await res.json();

        console.log("Geocode response:", data);

        if (!data.results || !data.results[0]) {
          alert("Geocoding failed for: " + c.address);
          throw new Error("Geocoding failed");
        }

        return data.results[0].geometry.location;
      })
    );

    console.log("WAYPOINTS:", waypoints);

    const origin = waypoints[0];
    const destination = waypoints[waypoints.length - 1];

    const waypointString = waypoints
      .slice(1, -1)
      .map((w) => `${w.lat},${w.lng}`)
      .join("|");

    console.log("Waypoint string:", waypointString);

    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&waypoints=optimize:true|${waypointString}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`;

    console.log("Directions URL:", directionsUrl);

    const directionsRes = await fetch(directionsUrl);
    const directionsData = await directionsRes.json();

    console.log("Directions response:", directionsData);

    if (!directionsData.routes || !directionsData.routes[0]) {
      alert("Route optimization failed. Check API key and enabled APIs.");
      return;
    }

    const optimizedOrder = directionsData.routes[0].waypoint_order;

    console.log("Optimized order:", optimizedOrder);

    const optimizedCustomerIds = [
      selectedCustomers[0].id,
      ...optimizedOrder.map((i) => selectedCustomers[i + 1].id),
      selectedCustomers[selectedCustomers.length - 1].id,
    ];

    console.log("Optimized customer IDs:", optimizedCustomerIds);

    await updateDoc(doc(db, "routes", route.id), {
      customers: optimizedCustomerIds,
    });

    setRoutes(
      routes.map((r) =>
        r.id === route.id ? { ...r, customers: optimizedCustomerIds } : r
      )
    );

    alert("Route optimized!");
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Route Planner</h1>

      {/* Create Route */}
      <form
        onSubmit={handleCreateRoute}
        className="bg-slate-800 p-6 rounded-lg shadow mb-8 max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Create New Route</h2>

        <input
          type="text"
          placeholder="Route Name (e.g., Route A)"
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white"
          value={newRouteName}
          onChange={(e) => setNewRouteName(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded"
        >
          Create Route
        </button>
      </form>

      {/* Route List */}
      <h2 className="text-2xl font-semibold mb-4">Your Routes</h2>

      {loading ? (
        <p className="text-gray-400">Loading routes...</p>
      ) : routes.length === 0 ? (
        <p className="text-gray-400">No routes created yet.</p>
      ) : (
        <div className="space-y-6">
          {routes.map((route) => (
            <div key={route.id} className="bg-slate-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3">{route.name}</h3>

              <p className="text-gray-400 mb-2">Assigned Customers:</p>

              {route.customers.length === 0 ? (
                <p className="text-gray-500 mb-4">No customers assigned.</p>
              ) : (
                <ul className="mb-4 list-disc list-inside text-gray-300">
                  {route.customers.map((cid) => {
                    const customer = customers.find((c) => c.id === cid);
                    return (
                      <li key={cid}>
                        {customer?.name} — {customer?.address}
                      </li>
                    );
                  })}
                </ul>
              )}

              <p className="text-gray-400 mb-2">Assign Customer:</p>

              <div className="space-y-2 mb-4">
                {customers
                  .filter((c) => !route.customers.includes(c.id))
                  .map((c) => (
                    <button
                      key={c.id}
                      onClick={() => assignCustomer(route.id, c.id)}
                      className="block w-full bg-slate-700 hover:bg-slate-600 py-2 rounded text-left px-3"
                    >
                      {c.name} — {c.address}
                    </button>
                  ))}
              </div>

              <button
                onClick={() => optimizeRoute(route)}
                className="bg-green-500 hover:bg-green-600 py-2 px-4 rounded"
              >
                Optimize Route
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}