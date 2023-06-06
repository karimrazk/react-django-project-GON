import { ResponsivePie } from "@nivo/pie";
import { useEffect, useState,useContext } from "react";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { getSecteurforAllProgramme } from "../utils/api";
import AuthContext from "../context/AuthContext";


const SecteurProgrammes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSecteurforAllProgramme();
        // Format the response data to match the expected format for the pie chart
        const formattedData = Object.entries(response).map(([secteur, percentage]) => ({
          id: secteur,
          label: secteur,
          value: percentage,
          tooltip: `${secteur}: ${percentage}%`, // Add tooltip with value when hovering over a sector
        }));
        setData(formattedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);


  return (
    <ResponsivePie
      data={data}
      tooltip={({ datum }) => (
        <div>
          <strong>{datum.label}</strong>
          <br />
          Valeur: {datum.value}%
        </div>
      )}
      theme={{
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
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 56,
          translateY: 56,
          itemWidth: 100,
          itemHeight: 18,
          itemsSpacing: 30,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
};
export default SecteurProgrammes;