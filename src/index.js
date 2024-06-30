import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { MaterialUIControllerProvider } from "context";
import { AuthProvider, AuthContext, rehydrateState } from "authContext";
import { DataProvider } from "./context/DataContext"; // Ensure the path is correct

const container = document.getElementById("app");
const root = createRoot(container);

const Root = () => {
  const { dispatch } = React.useContext(AuthContext);

  useEffect(() => {
    rehydrateState(dispatch);
  }, [dispatch]);

  return <App />;
};

root.render(
  <BrowserRouter>
    <AuthProvider>
      <MaterialUIControllerProvider>
        <DataProvider>
          <Root />
        </DataProvider>
      </MaterialUIControllerProvider>
    </AuthProvider>
  </BrowserRouter>
);
