import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import SystemDetails from "layouts/SystemDetails";
import UserManagement from "layouts/usersmanagement"; // Ensure the path is correct
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    protected: true,
    allowedRoles: ["admin", "user"],
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
  {
    type: "collapse",
    name: "User Management",
    key: "user-management",
    route: "/usersmanagement",
    icon: <Icon fontSize="small">person</Icon>,
    component: <UserManagement />,
    protected: true,
    allowedRoles: ["admin"], // Only allow admin users
  },
];

export default routes;
