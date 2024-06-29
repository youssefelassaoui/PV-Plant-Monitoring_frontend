import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "authContext"; // Adjust the path as necessary

const PrivateRoute = ({ element }) => {
  const { state } = useAuth();
  return state.isAuthenticated ? element : <Navigate to="/authentication/sign-in" />;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;
