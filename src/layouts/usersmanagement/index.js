import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Cookies from "js-cookie";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDButton from "components/MDButton";

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://geptest.pythonanywhere.com/api/users/", {
        headers: {
          Authorization: `Bearer ${Cookies.get("access")}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const { password, ...userDetails } = selectedUser; // Exclude password for updates
    if (isEditing) {
      try {
        await axios.put(
          `https://geptest.pythonanywhere.com/api/users/${selectedUser.id}/`,
          userDetails, // Use userDetails without password
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("access")}`,
            },
          }
        );
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      try {
        await axios.post("https://geptest.pythonanywhere.com/api/register-user/", selectedUser, {
          headers: {
            Authorization: `Bearer ${Cookies.get("access")}`,
          },
        });
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
    setOpen(false);
    fetchUsers();
  };

  const handleAdd = () => {
    setSelectedUser({
      username: "",
      email: "",
      password: "",
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://geptest.pythonanywhere.com/api/users/${id}/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access")}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "date_joined", headerName: "Date Joined", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  User Management
                </MDTypography>
                <MDButton onClick={handleAdd}>
                  Add User <AddIcon />
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                <div style={{ height: "66vh", width: "100%" }}>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <DataGrid
                      rows={users}
                      columns={columns}
                      pageSize={10}
                      autoHeight={true}
                      disableSelectionOnClick
                    />
                  )}
                </div>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {open && (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Username"
              name="username"
              value={selectedUser.username}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              value={selectedUser.email}
              onChange={handleInputChange}
              fullWidth
            />
            {!isEditing && (
              <TextField
                margin="dense"
                label="Password"
                name="password"
                type="password"
                value={selectedUser.password}
                onChange={handleInputChange}
                fullWidth
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default UsersManagement;
