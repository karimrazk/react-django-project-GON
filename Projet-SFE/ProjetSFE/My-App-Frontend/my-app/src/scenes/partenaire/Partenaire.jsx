import { Box, Button, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import Header from "../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { addPartenaire, deletePartenaire, getPartenaires, updatePartenaire } from "../../utils/api";
import { useSnackbar } from 'notistack';


const Partenaire = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    try {
      const response = await addPartenaire(formData);
      enqueueSnackbar('Le partenaire a été ajouté avec succès!', { variant: 'success' });
      const partenaires = await getPartenaires();
      setData(partenaires);
      handleClose();
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        console.error('Erreur lors de la création du partenaire!', error);
      }
    }
  };

  

  const handleEditPartenaire = async (id,updatedData) => {
    try {
      const updatedPartenaire = { nom: updatedData.nom };
      await updatePartenaire(id, updatedPartenaire);
      const partenaires = await getPartenaires();
      setData(partenaires);

      enqueueSnackbar('Les modifications apportées au partenaire ont été enregistrées avec succès!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erreur lors de la mise à jour des données!', { variant: 'error' });
    }
  };

  const handleDeletePartenaire = async (id) => {
    if (window.confirm(`Attention! Le partenaire que vous souhaitez supprimer a des contributions associées. Si vous continuez à supprimer ce partenaire, toutes les contributions associées seront également supprimées. Êtes-vous sûr(e) de vouloir supprimer ce partenaire?"`)) {
      try {
        await deletePartenaire(id);
        setData(data.filter((row) => row.id !== id));
      } catch (error) {
        console.log(error);
        enqueueSnackbar(`Une erreur s'est produite lors de la suppression du partenaire!`, { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    getPartenaires()
      .then(data => setData(data))
      .catch(error => console.log(error));
  }, []);

  const columns = [

    {
      field: "nom",
      headerName: "Nom du partenaire",
      flex: 1,
      editable: true,
      onEditCellChangeCommitted: (params) => {
        const updatedData = { nom: params.props.value };
        handleEditPartenaire(params.id, updatedData);
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 130,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Modifier">
              <IconButton
                edge="end"
                aria-label="Modifier"
                onClick={() => handleEditPartenaire(params.row.id, { nom: params.row.nom })}

              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Supprimer">
              <IconButton
                edge="end"
                aria-label="Supprimer"
                onClick={() => handleDeletePartenaire(params.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        );

      },
    },
  ];
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Partenaires" subtitle="Gestion de partenaire" />
        <Box>
          <Button onClick={handleOpen}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <AddIcon sx={{ mr: "10px" }} />
            Ajouter un partenaire
          </Button>
          <Box
            backgroundColor={colors.primary[400]}

          >
            <Dialog open={open}
              onClose={handleClose}
            >
              <DialogTitle variant="h5" color="secondary">Ajouter un nouveau partenaire</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Nom"
                    name="nom"
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

export default Partenaire;