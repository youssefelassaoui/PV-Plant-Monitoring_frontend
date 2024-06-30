import React, { useReducer, useEffect, useMemo, useContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const initialState = {
  isAuthenticated: false,
  user: null,
  userType: null,
  id: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        userType: action.payload.userType,
        id: action.payload.id,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        userType: null,
        id: null,
      };
    default:
      return state;
  }
};

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rehydrateState(dispatch).finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({ state, dispatch, loading }), [state, dispatch, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const login = async (dispatch, credentials) => {
  try {
    const response = await axios.post("http://geptest.pythonanywhere.com/api/token/", credentials, {
      withCredentials: true,
    });

    const { access, refresh, user_type } = response.data; // Assume user_type is part of the response
    const user = credentials.username;

    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    dispatch({ type: "LOGIN", payload: { user, userType: user_type, id: user } });

    // Set cookies with options
    Cookies.set("access", access, { path: "/", expires: 7 });
    Cookies.set("refresh", refresh, { path: "/", expires: 7 });
    Cookies.set("user", JSON.stringify(user), { path: "/", expires: 7 });
    Cookies.set("userType", user_type, { path: "/", expires: 7 });
    Cookies.set("id", user, { path: "/", expires: 7 });

    return true;
  } catch (error) {
    console.error("Login failed", error);
    return false;
  }
};

const signup = async (dispatch, userDetails) => {
  try {
    const response = await axios.post(
      "http://geptest.pythonanywhere.com/api/register/",
      userDetails,
      {
        withCredentials: true,
      }
    );

    const { username, email } = userDetails;

    // Auto-login after signup
    await login(dispatch, { username, email, password: userDetails.password });

    return true;
  } catch (error) {
    console.error("Signup failed", error);
    return false;
  }
};

const logout = (dispatch, navigate) => {
  dispatch({ type: "LOGOUT" });
  Cookies.remove("access");
  Cookies.remove("refresh");
  Cookies.remove("user");
  Cookies.remove("userType");
  Cookies.remove("id");
  delete axios.defaults.headers.common["Authorization"];
  navigate("/authentication/sign-in");
};

const rehydrateState = async (dispatch) => {
  const access = Cookies.get("access");
  if (access) {
    try {
      const response = await axios.post("http://geptest.pythonanywhere.com/api/token/verify/", {
        token: access,
      });

      const user = Cookies.get("user");
      const userType = Cookies.get("userType");
      const id = Cookies.get("id");

      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      dispatch({ type: "LOGIN", payload: { user: JSON.parse(user), userType, id } });

      // Ensure cookies are set again in case they were lost
      Cookies.set("userType", userType, { path: "/", expires: 7 });
      Cookies.set("id", id, { path: "/", expires: 7 });
    } catch (error) {
      console.error("Rehydration failed", error);
      dispatch({ type: "LOGOUT" });
    }
  }
};

export { AuthProvider, AuthContext, useAuth, login, signup, logout, rehydrateState };
