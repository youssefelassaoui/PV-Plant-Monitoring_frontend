import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./index"; // Adjust the path as necessary
import PropTypes from "prop-types";

const PrivateRoute = ({ element }) => {
  const { state } = useAuth();
  return state.isAuthenticated ? element : <Navigate to="/authentication/sign-in" />;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;
