import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [], useOutlet = false }) => {
  const isAuthenticated = localStorage.getItem("authToken");
  const userRoles = JSON.parse(localStorage.getItem("userRoles")) || [];
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRolesLower = userRoles.map((role) => role.toLowerCase());
  const allowedRolesLower = allowedRoles.map((role) => role.toLowerCase());
  const isAuthorized = userRolesLower.some((role) =>
    allowedRolesLower.includes(role),
  );

  if (isAuthorized) {
    return useOutlet ? <Outlet /> : children;
  } else {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;
