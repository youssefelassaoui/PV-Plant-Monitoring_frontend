import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [pvSystems, setPvSystems] = useState([]);
  const [systemPowers, setSystemPowers] = useState([]);
  const [systemTotals, setSystemTotals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePvSystems = await axios.get(
          "https://brilliant-sfogliatella-655498.netlify.app/api/pvsystems/",
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("access")}`,
            },
          }
        );
        setPvSystems(responsePvSystems.data);

        const responseTotalPowers = await axios.get(
          "https://brilliant-sfogliatella-655498.netlify.app/api/totals-p_dc/",
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("access")}`,
            },
          }
        );
        setSystemPowers(responseTotalPowers.data);

        const responseSystemTotals = await axios.get(
          "https://brilliant-sfogliatella-655498.netlify.app/api/system-totals/",
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("access")}`,
            },
          }
        );
        setSystemTotals(responseSystemTotals.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchSystemDetails = async (id) => {
    try {
      const response = await axios.get(
        `https://brilliant-sfogliatella-655498.netlify.app/api/pvsystems/${id}/calculate/`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access")}`,
          },
        }
      );
      return response.data.map((item) => ({
        ...item,

        calculated_power: Number(item.calculated_power).toFixed(2),
        current_t1: Number(item.current_t1).toFixed(2),
        current_t2: Number(item.current_t2).toFixed(2),
        voltage: Number(item.voltage).toFixed(2),
        gti: Number(item.gti).toFixed(2),
        air_temp: Number(item.air_temp).toFixed(2),
      }));
    } catch (error) {
      console.error("Error fetching system details:", error);
      return [];
    }
  };

  return (
    <DataContext.Provider
      value={{ pvSystems, systemPowers, systemTotals, fetchSystemDetails, loading }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DataContext, DataProvider };
