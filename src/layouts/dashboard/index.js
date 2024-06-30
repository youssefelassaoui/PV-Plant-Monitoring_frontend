import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { DataContext } from "context/DataContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const { pvSystems, systemPowers, systemTotals, loading } = useContext(DataContext);

  const getPieData = () => {
    const labels = systemPowers.map((system) => system.name);
    const data = systemPowers.map((system) => system.total_calculated_power);
    const totalPower = data.reduce((acc, curr) => acc + curr, 0);
    const backgroundColor = [
      "#FF6384", // Color for System 1
      "#36A2EB", // Color for System 2
      "#FFCE56", // Color for System 3
    ];

    const percentages = data.map((power) => ((power / totalPower) * 100).toFixed(2));

    return {
      labels,
      datasets: [
        {
          label: "Total Power by System",
          data,
          backgroundColor,
          hoverBackgroundColor: backgroundColor,
        },
      ],
      percentages,
    };
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value.toFixed(2)} W (${percentage}%)`;
          },
        },
      },
    },
  };

  const getBarData = () => {
    const labels = systemTotals.map((system) => system.name);
    const totalVoltage = systemTotals.map((system) => system.total_voltage);
    const totalPower = systemTotals.map((system) => system.total_calculated_power);
    const totalCurrent = systemTotals.map((system) => system.total_current_t1);
    const totalGti = systemTotals.map((system) => system.total_gti);
    const totalTemp = systemTotals.map((system) => system.total_air_temp);

    return {
      labels,
      datasets: [
        {
          label: "Total Voltage (V)",
          data: totalVoltage,
          backgroundColor: "#FF6384",
        },
        {
          label: "Total Power (W)",
          data: totalPower,
          backgroundColor: "#36A2EB",
        },
        {
          label: "Total Current T1 (A)",
          data: totalCurrent,
          backgroundColor: "#FFCE56",
        },
        {
          label: "Total GTI (W/m²)",
          data: totalGti,
          backgroundColor: "#4BC0C0",
        },
        {
          label: "Total Temperature (°C)",
          data: totalTemp,
          backgroundColor: "#9966FF",
        },
      ],
    };
  };

  const barOptions = {
    indexAxis: "x", // Ensure bars are horizontal
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Grid container spacing={3}>
              {pvSystems.map((system) => (
                <Grid item xs={12} md={6} lg={4} key={system.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div" gutterBottom>
                        {system.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Capacity: {system.capacity} kW
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Inverter Type: {system.inverter_type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Number of Panels: {system.number_of_panels}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Technology: {system.technology}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Year of Installation: {system.year_of_installation}
                      </Typography>
                      <Link
                        to={`/system/${system.id}`}
                        style={{
                          textDecoration: "none",
                          marginTop: "1rem",
                          display: "inline-block",
                        }}
                      >
                        <Typography variant="button" color="primary">
                          View Details
                        </Typography>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Grid container spacing={3} mt={3}>
              <Grid item xs={12} md={6} lg={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      Total Power Distribution
                    </Typography>
                    {systemPowers.length > 0 && (
                      <div style={{ width: "100%", height: "300px" }}>
                        <Pie data={getPieData()} options={options} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      System Totals
                    </Typography>
                    {systemTotals.length > 0 && (
                      <div style={{ width: "100%", height: "300px" }}>
                        <Bar data={getBarData()} options={barOptions} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Dashboard;
