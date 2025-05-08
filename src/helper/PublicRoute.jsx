// src/helper/PublicRoute.js
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  return isAuthenticated ? <Navigate to="/" /> : children;
};

export default PublicRoute;
