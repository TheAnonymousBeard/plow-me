import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RoutesPage from "./pages/Routes";
import Customers from "./pages/Customers";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import BusinessDashboard from "./pages/BusinessDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/business-dashboard" element={
          <ProtectedRoute>
            <BusinessDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/customers" element={ 
        <ProtectedRoute> 
          <Customers /> 
        </ProtectedRoute> } />
    <Route path="/routes" element={ 
    <ProtectedRoute> 
      <RoutesPage /> 
    </ProtectedRoute> } />
        </Routes>
  );
}

export default App;