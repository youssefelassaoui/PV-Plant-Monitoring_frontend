import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function useSystemDetails() {
  const { id } = useParams();
  const [system, setSystem] = useState(null);

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const response = await axios.get(
          `http://geptest.pythonanywhere.com /api/pvsystems/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("access")}`,
            },
          }
        );
        setSystem(response.data);
      } catch (error) {
        console.error("Error fetching system data:", error);
      }
    };

    fetchSystem();
  }, [id]);

  const columns = [
    { Header: "Parameter", accessor: "parameter" },
    { Header: "Value", accessor: "value" },
  ];

  const rows = system
    ? [
        { parameter: "Capacity", value: `${system.capacity} kW` },
        { parameter: "Inverter Type", value: system.inverter_type },
        { parameter: "Number of Panels", value: system.number_of_panels },
        { parameter: "Technology", value: system.technology },
        { parameter: "Year of Installation", value: system.year_of_installation },
      ]
    : [];

  return { columns, rows, system };
}

export default useSystemDetails;
