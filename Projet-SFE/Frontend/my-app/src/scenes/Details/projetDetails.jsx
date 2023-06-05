import React, { useRef } from 'react';
import { useContext } from 'react';
import Header from "../../components/Header";
import AuthContext from "../../context/AuthContext";
import Wordfile from "../../components/Wordfile";
import { Box, IconButton, Button, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from '../../theme';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';
import { getProjectsById, getListOfPartenairesName, addParticipation, getListOfParticipations, deleteParticipation, updateParticipation } from "../../utils/api";
import PartnerContrProjetChart from '../../BARChart/PartnerContrProjetChart';
import { useSnackbar } from 'notistack';
import ProjectDetails from './projetDataTable';


const ProjetDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { intitule_projet } = useParams();
  const { user } = useContext(AuthContext)
  const [projetData, setProjetData] = useState([]);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [listpartenaire, setListpartenaire] = useState([]);
  const [selectedPartenaire, setselectedPartenaire] = useState("");
  const { id_programme, programName, id_projet, projectName } = useParams();
  const formRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getProjectsById(id_projet)
      .then((projet) => setProjetData(projet))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    getListOfPartenairesName()
      .then((partenaires) => setListpartenaire(partenaires))
      .catch((error) => console.log(error));
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      partenaire: selectedPartenaire,
      projet: id_projet,
      contribution: event.target.contribution.value,
    };
    try {
      const newParticipation = await addParticipation(formData);
      const updatedParticipations = [
        ...data,
        {
          ...newParticipation,
          partenaire: {
            id: selectedPartenaire,
            nom: listpartenaire.find((partenaire) => partenaire.id === selectedPartenaire)?.nom || '',
          },
        },
      ];
      setData(updatedParticipations);
      enqueueSnackbar('La contribution a été ajouté avec succès!', { variant: 'success' });
      formRef.current.reset();
      handleClose();
    } catch (error) {
      if (error.response && error.response.data.non_field_errors) {
        const errorMessage = error.response.data.non_field_errors[0];
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
      else {
        enqueueSnackbar("La contribution existe déjà pour ce projet. Veuillez saisir une contribution différente.", { variant: 'error' });

      }
    }
  };


  useEffect(() => {
    getListOfParticipations(id_programme, id_projet)
      .then((data) => setData(data))
      .catch((error) => console.log(error));
  }, []);

  const handleDeletePart = async (id) => {
    if (
      window.confirm(
        `Êtes-vous sûr(e) de vouloir supprimer cette contribution ? Cette action est irréversible et toutes les données associées à cette contribution seront perdues.`
      )
    ) {
      try {
        await deleteParticipation(id);
        setData(data.filter((row) => row.id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEditParticipation = async (id, updatedData) => {
    try {
      const updatedParticipation = {
        projet: id_projet, // Include the project ID
        partenaire: updatedData.partenaire.id, // Include the partner ID
        contribution: updatedData.contribution,
      };
      await updateParticipation(id, updatedParticipation);
      const updatedParticipations = data.map((participation) => {
        if (participation.id === id) {
          return {
            ...participation,
            partenaire: {
              ...participation.partenaire,
              nom: updatedData.partenaire.nom,
            },
            contribution: updatedData.contribution,
          };
        }
        return participation;
      });
      setData(updatedParticipations);
      enqueueSnackbar('Les modifications apportées a cette contribution ont été enregistrées avec succès!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erreur lors de la mise à jour des données!', { variant: 'error' });
    }
  };

  const columns = [
    {
      field: "partenaire.nom",
      headerName: "Partenaire",
      headerAlign: "left",
      align: "left",
      flex: 1,
      valueGetter: (params) => params.row.partenaire.nom,
    },
    {
      field: "contribution",
      headerName: "Contribution",
      headerAlign: "left",
      align: "left",
      flex: 1,
      type: "number",
      editable: true,
      onEditCellChangeCommitted: (params) => {
        const updatedData = { contribution: params.props.value };
        handleEditParticipation(params.id, updatedData);
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 130,
      renderCell: (params) => (
        <>
          <Tooltip title="Modifier">
            <IconButton edge="end" aria-label="Modifier" onClick={() => handleEditParticipation(params.id, params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton edge="end" aria-label="Supprimer" onClick={() => handleDeletePart(params.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];


  return (
    <Box m="20px">

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Contributions" subtitle={`Gérez les contributions des partenaires pour ce projet avec facilité !`}
        />
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button onClick={handleOpen}
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
                marginRight: '10px',
              }}
            >
              <AddIcon sx={{ mr: "10px" }} />
              Ajouter une contribution
            </Button>
            <Wordfile id_projet={id_projet} />
          </Box>

          <Box
            backgroundColor={colors.primary[400]}
          >
            <Dialog open={open}
              onClose={handleClose}
            >
              <DialogTitle variant="h5" color="secondary">Ajouter une contribution</DialogTitle>
              <DialogContent>
                <form ref={formRef} onSubmit={handleSubmit}>
                  <FormControl fullWidth style={{ marginTop: '16px' }}>
                    <InputLabel id="partenaire-select">Partenaire</InputLabel>
                    <Select
                      labelId="partenaire-select-label"
                      id="partenaire-select"
                      value={selectedPartenaire}
                      label="Choisissez un partenaire"
                      onChange={(event) => {
                        setselectedPartenaire(event.target.value);
                      }
                      }
                    >
                      <MenuItem value="" disabled>
                        Choisissez un partenaire
                      </MenuItem>
                      {listpartenaire.map((partenaire) => (
                        <MenuItem key={partenaire.id} value={partenaire.id}>
                          {partenaire.nom}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Contribution"
                    name="contribution"
                    fullWidth
                    margin="normal"
                    required={true}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleClose} color="secondary">Annuler</Button>
                    <Button type="submit" color="secondary">Ajouter</Button>
                  </div>
                </form>
              </DialogContent>
              <DialogActions>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
       
      </Box>
     
       
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
            gridColumn="span 12"
            gridRow="span 6"
          >
            <Box
              mt="20px"
              p="0 30px"
              display="flex "
              justifyContent="space-between"
              alignItems="center"
            >
              <ProjectDetails project={projetData} />
            </Box>
          </Box>
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="20px"
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
                Répartition des contributions par partenaire

              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Budget global du projet : {projetData.budget_global} dh
              </Typography>
            </Box>
            <Box>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <PartnerContrProjetChart isDashboard={true} id_projet={id_projet} id_programme={id_programme} />
          </Box>
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

}


export default ProjetDetails;

