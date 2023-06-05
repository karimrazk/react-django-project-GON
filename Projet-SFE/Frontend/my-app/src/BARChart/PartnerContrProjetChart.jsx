import { useTheme , Typography, Box} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import { getPartnerContributionPerProjet } from "../utils/api";


const PartnerContrProjetChart = ({  isDashboard = false, id_projet, id_programme}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPartnerContributionPerProjet(id_projet,id_programme);
        if (response && Object.keys(response).length > 0) {
          const formattedData = response.partner_contributions.map((item) => ({
            partenaire: item.partenaire__nom,
            contribution: item.total_contribution,
          }));
          setData(formattedData);
        }else {
          setData([]);
            }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id_projet, id_programme]);

  if (!data || data.length === 0) {
    return (
      <Box p={2}>
        <Typography variant="body1">Aucune contribution n'a été effectuée pour ce projet.</Typography>
      </Box>
    );
  }

  const CustomTooltip = ({ id, value }) => (
    <div
      style={{
        background: colors.grey[100],
        padding: "8px",
        borderRadius: "4px",
      }}
    >
      <span style={{ color: colors.grey[700] }}>
        {id}: {value} dh
      </span>
    </div>
  );

  return (
    
    <ResponsiveBar
      data={data}
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
      keys={["contribution"]}
      indexBy="partenaire"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.8}
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
        legend: isDashboard ? undefined : "Partenaires",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={e => `${e.id}: ${e.formattedValue} in partenaire: ${e.indexValue}`}
      legends={[
        {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
                {
                    on: 'hover',
                    style: {
                        itemOpacity: 1
                    }
                }
            ]
        }
    ]}
    tooltip={CustomTooltip}

    />
  );
};

export default PartnerContrProjetChart;
