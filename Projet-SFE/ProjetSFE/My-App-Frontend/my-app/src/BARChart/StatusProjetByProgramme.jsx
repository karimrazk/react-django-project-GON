import { useTheme , Typography, Box} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import { getcountStatusProjetByProgramme } from "../utils/api"; 



const StatusProjetByProgramme = ({ isDashboard = false,id_programme }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getcountStatusProjetByProgramme(id_programme);
        const formattedData = Object.entries(response).map(([statut, count]) => {
          let label = "";
          if (statut === "count_planifie") {
            label = "Planifier";
          } else if (statut === "count_en_cours_demarrage") {
            label = "en cours de démarrage";
          } else if (statut === "count_en_cours_realisation") {
            label = "en cours de réalisation";
          } else if (statut === "count_achevee") {
            label = "Achevé";
          }

          return {
            id: statut,
            label: label,
            Valeur: count,
          };
        });
        const filteredData = formattedData.filter((item) => item.id !== "count_all");

        setData(filteredData);
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

  if (!data || data.length === 0) {
    return (
      null
    );
  }

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

export default StatusProjetByProgramme;


