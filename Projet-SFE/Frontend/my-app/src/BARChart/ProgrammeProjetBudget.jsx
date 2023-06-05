import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import { getBudgetProjetProgramme } from "../utils/api"; 




const ProgrammeProjetBudget = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBudgetProjetProgramme();
        setData(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const formattedData = data.map((program) => {
    const programData = {
      intitule_programme: program.intitule_programme,
    };

    // Get a list of all project names
    const projectNames = program.projects.map((project) => project.intitule_projet);

    // Initialize each project with a budget of 0
    projectNames.forEach((projectName) => {
      programData[projectName] = 0;
    });

    // Set the budget for each project
    program.projects.forEach((project) => {
      const projectName = project.intitule_projet;
      const budgetKey = `${projectName}_budget`;
      const budgetValue = project.budget_global;

      programData[projectName] = budgetValue;
      programData[budgetKey] = budgetValue;
    });

    return programData;
  });

  const keys = formattedData.length > 0 ? Object.keys(formattedData[0]).filter((key) => key !== "intitule_programme") : [];


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
      data={formattedData}
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
      keys={keys}
      indexBy="intitule_programme"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.7}
    //   layout="horizontal"
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
        legend: isDashboard ? undefined : "Budget Global", // Adjust the legend text if used in a dashboard
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "", // Adjust the legend text if used in a dashboard
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
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue} in ${e.indexValue}`}
      tooltip={CustomTooltip}

    />
  );
};

export default ProgrammeProjetBudget;


