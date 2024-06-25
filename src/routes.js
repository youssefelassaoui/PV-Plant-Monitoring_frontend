import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import SignIn from "layouts/authentication/sign-in";
import Icon from "@mui/material/Icon";
import SystemDetails from "layouts/SystemDetails"; // Make sure the path is correct

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    protected: true,
  },

  {
    type: "route",
    key: "sign-in",
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "route",
    key: "system-details",
    route: "/system/:id",
    component: <SystemDetails />,
  },
];

export default routes;
