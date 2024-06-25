import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Cookies from "js-cookie"; // Add this import

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function SystemDetails() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [system, setSystem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/pvsystems/", {
          headers: {
            Authorization: `Bearer ${Cookies.get("access")}`,
          },
        });
        const data = response.data;
        setSystem(data);

        const cols = [
          { Header: "Name", accessor: "name" },
          { Header: "Capacity", accessor: "capacity" },
          { Header: "Inverter Type", accessor: "inverter_type" },
          { Header: "Number of Panels", accessor: "number_of_panels" },
          { Header: "Technology", accessor: "technology" },
          { Header: "Year of Installation", accessor: "year_of_installation" },
        ];
        setColumns(cols);

        const rowsData = data.map((system) => ({
          name: system.name,
          capacity: `${system.capacity} kW`,
          inverter_type: system.inverter_type,
          number_of_panels: system.number_of_panels,
          technology: system.technology,
          year_of_installation: system.year_of_installation,
        }));
        setRows(rowsData);
      } catch (error) {
        console.error("Error fetching PV systems data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  PV Systems
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default SystemDetails;
