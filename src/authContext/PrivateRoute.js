import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "authContext"; // Adjust the path as necessary
import PropTypes from "prop-types";

const PrivateRoute = ({ element, allowedRoles }) => {
  const { state } = useAuth();
  const { isAuthenticated, userType } = state;

  if (!isAuthenticated) {
    return <Navigate to="/authentication/sign-in" />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/dashboard" />;
  }

  return element;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
