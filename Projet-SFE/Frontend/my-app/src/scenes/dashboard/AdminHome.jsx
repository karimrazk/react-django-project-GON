import { Box, Button, IconButton, Typography, useTheme,Tooltip } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import ProjectIcon from '@mui/icons-material/PlaylistAddCheck';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StatBox from "../../components/StatBox";
import HandshakeIcon from '@mui/icons-material/Handshake';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Header from "../../components/Header";
import DistributionDivisionADM from "../../BARChart/DistributionDivisionADM";
import { getNbrPrjPrgPartUserforAdminSup, getProgrammes } from "../../utils/api";
import DistributionRoleEmp from "../../BARChart/DistributionRoleEmp";
import { useNavigate } from "react-router-dom";




const AdminHome = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(0);
  const [programmesData, setProgrammesData] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    getNbrPrjPrgPartUserforAdminSup()
      .then((data) => setData(data))
      .catch((error) => console.log(error));

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProgrammes();
        setProgrammesData(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Tableau de bord" subtitle="Bienvenue sur votre tableau de bord" />

        <Box>
          <Button
          onClick={() => {
            navigate("/AdminDashboard/calendar");
          }}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <NotificationAddIcon sx={{ mr: "10px" }} />
            Ajouter un nouvel événement
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.user_count}
            subtitle="Total d'utilisateurs"
            progress={data.user_count / 100}
            increase=""
            icon={
              <PeopleAltIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.program_count}
            subtitle="Total de programmes"
            progress={data.program_count / 100}
            increase=""
            icon={
              <AssignmentIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.project_count}
            subtitle="Total de projets"
            progress={data.project_count / 100}
            increase=""
            icon={
              <ProjectIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.partner_count}
            subtitle="Total de partenaires"
            progress={data.partner_count / 100}
            increase=""
            icon={
              <HandshakeIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Distribution des utilisateurs par rôle
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {/* $59,342.32 */}
              </Typography>
            </Box>
            <Box>
            <Tooltip title="Accéder à la page des fonctionnaires">
              <IconButton onClick={() => {
                navigate("/AdminDashboard/fonctionnaire");
              }}>
                <VisibilityIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <DistributionRoleEmp isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            color={colors.grey[100]}
            p="15px"
          >
            <Typography variant="h5" fontWeight="600">
              Vues d'ensemble des programmes
            </Typography>
          </Box>
          {programmesData.map((programme) => (
            <Box
              key={programme.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {programme.intitule_programme}
                </Typography>
                <Typography color={colors.grey[100]}>
                  Nombre de projets: {programme.nombre_projets}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{programme.date_debut}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {programme.cout_global} dh
              </Box>
            </Box>
          ))}
        </Box>

       
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
           Distribution des utilisateurs par division
          </Typography>
          <Box height="250px" mt="-20px">
            <DistributionDivisionADM isDashboard={true} />
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default AdminHome;