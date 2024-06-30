import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Line } from "react-chartjs-2";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CircularProgress from "@mui/material/CircularProgress";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DataContext } from "context/DataContext";
import {
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Chart,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";

Chart.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

function SystemDetails() {
  const { id } = useParams();
  const { fetchSystemDetails, loading } = useContext(DataContext);
  const [systemData, setSystemData] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    const getSystemDetails = async () => {
      const data = await fetchSystemDetails(id);
      setSystemData(data);
      setLocalLoading(false);
    };

    if (!loading) {
      getSystemDetails();
    }
  }, [id, loading, fetchSystemDetails]);

  const formattedData = systemData.map((item) => ({
    ...item,
    formatted_time: new Date(item.time).toLocaleString(), // Add a formatted time field for DataGrid
  }));

  const data = {
    labels: systemData.map((data) => new Date(data.time)), // Keep original Date object for the chart
    datasets: [
      {
        label: "Calculated Power (W)",
        data: systemData.map((data) => data.calculated_power),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Current T1 (A)",
        data: systemData.map((data) => data.current_t1),
        borderColor: "rgb(153, 102, 255)",
        tension: 0.1,
      },
      {
        label: "Current T2 (A)",
        data: systemData.map((data) => data.current_t2),
        borderColor: "rgb(255, 159, 64)",
        tension: 0.1,
      },
      {
        label: "Voltage (U_DC) (V)",
        data: systemData.map((data) => data.voltage),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Solar Irradiance (GTI) (W/m²)",
        data: systemData.map((data) => data.gti),
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
      {
        label: "Temperature (Air_Temp) (°C)",
        data: systemData.map((data) => data.air_temp),
        borderColor: "rgb(255, 206, 86)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            return `${label}: ${Number(value).toFixed(2)}`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const selected = systemData[elementIndex];
        setSelectedData(selected);
        setOpen(true);
      }
    },
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedData(null);
  };

  const columns = [
    { field: "formatted_time", headerName: "Time", width: 200 }, // Use formatted_time for DataGrid
    { field: "calculated_power", headerName: "Calculated Power (W)", width: 200 },
    { field: "current_t1", headerName: "Current T1 (A)", width: 150 },
    { field: "current_t2", headerName: "Current T2 (A)", width: 150 },
    { field: "voltage", headerName: "Voltage (V)", width: 150 },
    { field: "gti", headerName: "Solar Irradiance (GTI) (W/m²)", width: 200 },
    { field: "air_temp", headerName: "Temperature (°C)", width: 150 },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  System {id} Details
                </Typography>
                {localLoading ? <CircularProgress /> : <Line data={data} options={options} />}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Data Table
                </Typography>
                {localLoading ? (
                  <CircularProgress />
                ) : (
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                      rows={formattedData.map((row, index) => ({ id: index, ...row }))}
                      columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[10]}
                      components={{ Toolbar: GridToolbar }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Data Point Details</DialogTitle>
        <DialogContent>
          {selectedData && (
            <>
              <Typography>Time: {new Date(selectedData.time).toLocaleString()}</Typography>
              <Typography>Calculated Power: {selectedData.calculated_power} W</Typography>
              <Typography>Current T1: {selectedData.current_t1} A</Typography>
              <Typography>Current T2: {selectedData.current_t2} A</Typography>
              <Typography>Voltage: {selectedData.voltage} V</Typography>
              <Typography>Solar Irradiance (GTI): {selectedData.gti} W/m²</Typography>
              <Typography>Temperature (Air_Temp): {selectedData.air_temp} °C</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

SystemDetails.propTypes = {
  id: PropTypes.string,
};

export default SystemDetails;
