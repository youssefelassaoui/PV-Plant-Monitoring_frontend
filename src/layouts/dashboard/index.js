import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import axios from "axios";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Cookies from "js-cookie";

function Dashboard() {
  const [pvSystems, setPvSystems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/pvsystems/", {
          headers: {
            Authorization: `Bearer ${Cookies.get("access")}`, // Make sure to include the JWT token
          },
        });
        setPvSystems(response.data);
      } catch (error) {
        console.error("Error fetching PV systems data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {pvSystems.map((system) => (
            <Grid item xs={12} md={6} lg={4} key={system.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {system.name}
                  </Typography>
                  <Typography color="text.secondary">Capacity: {system.capacity} kW</Typography>
                  <Typography color="text.secondary">
                    Inverter Type: {system.inverter_type}
                  </Typography>
                  <Typography color="text.secondary">
                    Number of Panels: {system.number_of_panels}
                  </Typography>
                  <Typography color="text.secondary">Technology: {system.technology}</Typography>
                  <Typography color="text.secondary">
                    Year of Installation: {system.year_of_installation}
                  </Typography>
                  <Link to={`/system/${system.id}`}>View Details</Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Dashboard;
