import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import { getStatusProjetForAllProgrammes } from "../utils/api";


const StatusProjetForAllProgrammes = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStatusProjetForAllProgrammes();
        setData([
          { label: "En cours de démarrage", Valeur: response["En cours de démarrage"] },
          { label: "Planifié", Valeur: response["Planifié"] },
          { label: "En cours de réalisation", Valeur: response["En cours de réalisation"] },
          { label: "Achevée", Valeur: response["Achevée"] },
        ]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ id, value }) => (
    <div
      style={{
        background: colors.grey[100],
        padding: "8px",
        borderRadius: "4px",
      }}
    >
      <span style={{ color: colors.grey[700] }}>
        {id}: {value}
      </span>
    </div>
  );


  return (
    <ResponsiveBar
      data={data}
      theme={{
        // added
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={["Valeur"]}
      indexBy="label"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.7}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      colorBy="indexValue"
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "statut des projets", // Adjust the legend text if used in a dashboard
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Count", // Adjust the legend text if used in a dashboard
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={e=>e.id+": "+e.formattedValue+" in label: "+e.indexValue}
      tooltip={CustomTooltip}

    />
  );
};

export default StatusProjetForAllProgrammes;


