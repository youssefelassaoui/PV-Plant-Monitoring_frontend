import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Line } from "react-chartjs-2";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Cookies from "js-cookie";
import CircularProgress from "@mui/material/CircularProgress";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
import { format } from "date-fns";

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
  const [systemData, setSystemData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://geptest.pythonanywhere.com/api/pvsystems/${id}/calculate/`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("access")}`,
            },
          }
        );
        setSystemData(
          response.data.map((item) => ({
            ...item,
            calculated_power: Number(item.calculated_power).toFixed(2),
            current_t1: Number(item.current_t1).toFixed(2),
            current_t2: Number(item.current_t2).toFixed(2),
            voltage: Number(item.voltage).toFixed(2),
            gti: Number(item.gti).toFixed(2),
            air_temp: Number(item.air_temp).toFixed(2),
            time: format(new Date(item.time), "yyyy-MM-dd HH:mm:ss"), // Format date
          }))
        );
      } catch (error) {
        console.error("Error fetching system data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const data = {
    labels: systemData.map((data) => data.time),
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
    { field: "time", headerName: "Time", width: 200 },
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
                {loading ? <CircularProgress /> : <Line data={data} options={options} />}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Data Table
                </Typography>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                      rows={systemData.map((row, index) => ({ id: index, ...row }))}
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
              <Typography>Time: {selectedData.time}</Typography>
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
