// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null; // or a loader
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

