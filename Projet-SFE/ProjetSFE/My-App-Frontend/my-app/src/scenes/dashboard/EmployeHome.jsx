import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect, useContext } from 'react';
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import SecteurProgrammesUser from "../../PieChart/SecteurProgrammesUser";
import StatusProjetChart from "../../BARChart/StatutProjChart";
import { getNewlyCreatedProjet, getNbrReunionForUser, getCountProgProjByUser, getProjectsForUser } from "../../utils/api";
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AuthContext from "../../context/AuthContext";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import ProjectIcon from '@mui/icons-material/PlaylistAddCheck';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';



const EmployeHome = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext)
  const [newprojet, setNewprojet] = useState(0);
  const [nbrReunion, setNbrReunion] = useState(0);
  const [countProjProg, setCountProjProg] = useState(0);
  const navigate = useNavigate();
  const [projectsForUser, setprojectsForUser] = useState([]);

  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const response = await getProjectsForUser(user.user_id);
        setprojectsForUser(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProjets();
  }, []);


  useEffect(() => {
    getNewlyCreatedProjet()
      .then((projet) => setNewprojet(projet))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    getNbrReunionForUser(user.user_id)
      .then((reunion) => setNbrReunion(reunion))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    getCountProgProjByUser(user.user_id)
      .then((data) => setCountProjProg(data))
      .catch((error) => console.log(error));
  }, []);

  const handleViewPrograms = () => {
    navigate('/EmployeDashboard/programme');
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Tableau de bord" subtitle="Bienvenue sur votre tableau de bord" />
        <Box>
          <Button
            onClick={handleViewPrograms}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <AssignmentIcon sx={{ mr: "10px" }} />
            Visualiser les programmes
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
            title={countProjProg.program_count}
            subtitle="Nombre de programmes"
            progress={countProjProg.program_count / 100}
            increase=""
            icon={
              <AccountTreeIcon
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
            title={countProjProg.project_count}
            subtitle="Nombre de projets"
            progress={countProjProg.project_count / 100}
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
            title={nbrReunion.count_nbr_reunion}
            subtitle="Nombre d'événements"
            progress={nbrReunion.count_nbr_reunion / 100}
            increase=""
            icon={
              <EditCalendarIcon
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
            title={newprojet.count_new_projet}
            subtitle=" Nouveaux projets"
            progress={newprojet.count_new_projet / 100}
            increase=""
            icon={
              <AutoGraphIcon
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
                Répartition des statuts des projets pour vos programmes
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Nombre de projets: {countProjProg.project_count}
              </Typography>
            </Box>
            <Box>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <StatusProjetChart />
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
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Projets Passionnants pour Vous !
            </Typography>
          </Box>
          {projectsForUser.map((project) => (
            <Box
              key={project.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h6"
                  fontWeight="600"
                >
                  {project.intitule_projet}
                </Typography>
                <Typography color={colors.grey[100]}>
                  Taux d'avancement: {project.taux_davancement}%
                </Typography>
              </Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {project.budget_global}dh
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography variant="h5" fontWeight="600" sx={{ padding: "30px 30px 0 30px" }}
          >
            Répartition des secteurs pour vos programmes
          </Typography>
          <Box height="270px" mt="-20px">
            <SecteurProgrammesUser size="150" />
          </Box>
        </Box>
      </Box>
    </Box>

  );
};

export default EmployeHome;