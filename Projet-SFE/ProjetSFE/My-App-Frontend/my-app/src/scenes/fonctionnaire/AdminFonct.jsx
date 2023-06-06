import { Box, Button, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, MenuItem, Select, InputLabel, FormControl, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import Header from "../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { getUsers, addUser, deleteUser } from "../../utils/api";
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';



const FonctionnaireADM = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleEditfonct = (id) => {
    navigate(`modifierFonctionnaire/${id}`);
  };

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
    const userData = {
      last_name: formData.get('last_name'),
      first_name: formData.get('first_name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: selectedRole,
      division: selectedDivision,
      service: selectedService,
    };
    try {
      const response = await addUser(userData);
      enqueueSnackbar('Le fonctionnaire a été ajouté avec succès.', { variant: 'success' });
      handleClose();
      const users = await getUsers();
      setData(users);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });}
  };


  const handleDeletefonct = async (id) => {
    if (window.confirm(`Veuillez noter que si vous supprimez un fonctionnaire, il est possible qu'il ait participé à certains programmes qui pourraient être impactés.`)) {
      try {
        await deleteUser(id);
        setData(data.filter((row) => row.id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };


  useEffect(() => {
    getUsers()
      .then(data => setData(data))
      .catch(error => console.log(error));
  }, []);



  const columns = [

    {
      field: "last_name",
      headerName: "Nom",
      flex: 1,

    },
    {
      field: "first_name",
      headerName: "Prenom",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "division",
      headerName: "Division",
      flex: 0.9,
    },
    {
      field: "service",
      headerName: "Service",
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 130,
      renderCell: (params) => (
        <>
        <Tooltip title="Modifier">
          <IconButton edge="end" aria-label="Supprimer" onClick={() => handleEditfonct(params.id)}>
            <EditIcon />
          </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
          <IconButton edge="end" aria-label="Supprimer" onClick={() => handleDeletefonct(params.id)}>
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
        <Header title="Fonctionnaires" subtitle="Gestion de fonctionnaires" />

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
            Ajouter un fonctionnaire
          </Button>
          <Box
            backgroundColor={colors.primary[400]}
          >
            <Dialog open={open}
              onClose={handleClose} 
            >
              <DialogTitle variant="h5" color="secondary">Ajouter un nouveau fonctionnaire</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Nom"
                    name="last_name"
                    fullWidth
                    margin="normal"
                    required={true}
                  />
                  <TextField
                    label="Prénom"
                    name="first_name"
                    fullWidth
                    margin="normal"
                    required={true}
                  />

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <TextField
                        label="Adresse email"
                        name="email"
                        fullWidth
                        type="email"
                        margin="normal"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Mot de passe"
                        name="password"
                        fullWidth
                        type="password"
                        margin="normal"
                        InputProps={{ minLength: 8 }}
                        required={true}
                      />
                    </Grid>
                  </Grid>
                  <FormControl fullWidth style={{ marginTop: '16px' }}>
                    <InputLabel id="role-select">Role</InputLabel>
                    <Select
                      labelId="partenaire-select-label"
                      id="role-select"
                      value={selectedRole}
                      label="Choisissez le role"
                      required={true}
                      onChange={(event) => {
                        setSelectedRole(event.target.value);
                      }}
                    >
                      <MenuItem value="" disabled>
                        Choisissez le role
                      </MenuItem>
                      <MenuItem value="ADMIN">Admin</MenuItem>
                      <MenuItem value="EMPLOYE">Employe</MenuItem>
                      <MenuItem value="SUPERVISEUR">Superviseur</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: '16px' }}>
                    <InputLabel id="division-select">Division</InputLabel>
                    <Select
                      labelId="partenaire-select-label"
                      id="division-select"
                      value={selectedDivision}
                      label="Choisissez une division"
                      required={true}
                      onChange={(event) => {
                        setSelectedDivision(event.target.value);
                      }}
                    >
                      <MenuItem value="" disabled>
                        Choisissez une division
                      </MenuItem>
                      <MenuItem value="DRINDH">DRINDH</MenuItem>
                      <MenuItem value="DESM">DESM</MenuItem>
                      <MenuItem value="DRCT">DRCT</MenuItem>
                      <MenuItem value="DCS">DCS</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: '16px' }}>
                    <InputLabel id="service-select">Service</InputLabel>
                    <Select
                      labelId="partenaire-select-label"
                      id="service-select"
                      value={selectedService}
                      label="Choisissez  un service"
                      required={true}
                      onChange={(event) => {
                        setSelectedService(event.target.value);
                      }}
                    >
                      <MenuItem value="" disabled>
                        Choisissez un service
                      </MenuItem>
                      <MenuItem value="SCP">SCP</MenuItem>
                      <MenuItem value="SFMSP">SFMSP</MenuItem>
                    <MenuItem value="SPC">SPC</MenuItem>
                    <MenuItem value="SSCRC">SSCRC</MenuItem>
                    <MenuItem value="SRR">SRR</MenuItem>
                    <MenuItem value="SSPP">SSPP</MenuItem>
                    </Select>
                  </FormControl>
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
export default FonctionnaireADM;