import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [pvSystems, setPvSystems] = useState([]);
  const [systemPowers, setSystemPowers] = useState([]);
  const [systemTotals, setSystemTotals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePvSystems = await axios.get("https://geptest.pythonanywhere.com/api/pvsystems/", {
          headers: {
            Authorization: `Bearer ${Cookies.get("access")}`,
          },
        });
        setPvSystems(responsePvSystems.data);

        const responseTotalPowers = await axios.get("https://geptest.pythonanywhere.com/api/totals-p_dc/", {
          headers: {
            Authorization: `Bearer ${Cookies.get("access")}`,
          },
        });
        setSystemPowers(responseTotalPowers.data);

        const responseSystemTotals = await axios.get("https://geptest.pythonanywhere.com/api/system-totals/", {
          headers: {
            Authorization: `Bearer ${Cookies.get("access")}`,
          },
        });
        setSystemTotals(responseSystemTotals.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ pvSystems, systemPowers, systemTotals, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
