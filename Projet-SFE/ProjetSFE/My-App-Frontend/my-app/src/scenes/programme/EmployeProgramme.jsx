import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton, Tooltip } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect, useContext } from 'react';
import Header from "../../components/Header";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../../context/AuthContext";
import { getProgrammesForEMP } from "../../utils/api";
import FileExport from "../../components/Excelfile";

const ProgrammeEMP = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext)


  const handleViewProg = (id, intitule_programme) => {
    navigate(`programmeDetails/${id}/${intitule_programme}`);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProgrammesForEMP(user.user_id);
        setData(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user.user_id]);


  const columns = [
    {
      field: "intitule_programme",
      headerName: "Intilule du programme",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "date_debut",
      headerName: "Date de début",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "date_fin",
      headerName: "Date de fin",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "cout_global",
      headerName: "Cout global (MAD)",
      headerAlign: "left",
      align: "left",
      flex: 1,

    },
    {
      field: "nombre_projets",
      headerName: "Nombre de projets",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "observation_programme",
      headerName: "Observation",
      headerAlign: "left",
      align: "left",
      flex: 1,

    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 130,
      renderCell: (params) => (
        <>
          <Tooltip title="Cliquez ici pour plus de détails sur ce programme.">
            <IconButton edge="end" aria-label="View" onClick={() => handleViewProg(params.id, params.row.intitule_programme)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Programmes" subtitle="Maximisez la productivité, minimisez la complexité" />
        <Box>
        <FileExport data={data} />
      </Box>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[800],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[800],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default ProgrammeEMP;