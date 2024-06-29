import React, { useEffect, useContext } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { MaterialUIControllerProvider } from "context";
import { AuthProvider, AuthContext, rehydrateState } from "authContext";

const container = document.getElementById("app");
const root = createRoot(container);

const Root = () => {
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    rehydrateState(dispatch);
  }, [dispatch]);

  return <App />;
};

root.render(
  <BrowserRouter>
    <AuthProvider>
      <MaterialUIControllerProvider>
        <Root />
      </MaterialUIControllerProvider>
    </AuthProvider>
  </BrowserRouter>
);
