import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./index"; // Adjust the path as necessary
import PropTypes from "prop-types";

const PrivateRoute = ({ element, allowedRoles }) => {
  const { state } = useAuth();
  const { isAuthenticated, userType } = state;

  return isAuthenticated && allowedRoles.includes(userType) ? (
    element
  ) : (
    <Navigate to="/authentication/sign-in" />
  );
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PrivateRoute;
