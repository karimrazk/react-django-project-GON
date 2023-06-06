import { Box, Button, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, InputLabel, FormControl, MenuItem, Select, ListItemText, OutlinedInput, Checkbox, Tooltip } from "@mui/material";
import moment from 'moment';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import Header from "../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { getUsersEMPLOYE, addProgramme, getProgrammes, deleteProgramme } from "../../utils/api";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';


const ProgrammeADM = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [minEndDate, setMinEndDate] = useState(null);

  useEffect(() => {
    getUsersEMPLOYE()
      .then((data) => setListUser(data))
      .catch((error) => console.log(error));
  }, []);


  const handleStartDateChange = (date) => {
    setStartDate(date);
    setMinEndDate(date);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleViewProgramme = (id, intitule_programme) => {
    navigate(`modifierProgramme/${id}/${intitule_programme}`);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const dateDebutField = form.elements.date_debut;
    const formattedDateDebut = moment(dateDebutField.value).format('YYYY-MM-DD');
    const dateFinField = form.elements.date_fin;
    const formattedDateFin = moment(dateFinField.value).format('YYYY-MM-DD');
    const formData = new FormData(form);
    formData.set('date_debut', formattedDateDebut);
    formData.set('date_fin', formattedDateFin);
    selectedUsers.forEach((user) => {
      formData.append("users", user);
    });
    if (formData.get('date_debut') < formData.get('date_fin')) {
        try {
      await addProgramme(formData);
      handleClose();
      const response = await getProgrammes();
      setData(response);
      
    } catch (error) {
      console.error(error);
    }      
    } else alert("La date de début ne peut pas être supérieure à la date de fin"); 
  };


  const handleDeleteProg = async (id) => {
    if (
      window.confirm(
        `Attention : en supprimant ce programme, vous perdrez également tous les projets qui y sont associés. Prenez cette décision en tenant compte de l'impact sur vos projets en cours.`
      )
    ) {
      try {
        await deleteProgramme(id);
        setData(data.filter((row) => row.id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };


  useEffect(() => {
    getProgrammes()
      .then(response => {
        setData(response);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);



  const columns = [
    {
      field: "intitule_programme",
      headerName: "Intitule du programme",
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
      headerName: "Cout global",
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
          
          <Tooltip title="Edit">
            <IconButton edge="end" aria-label="Edit" onClick={() => handleViewProgramme(params.id, params.row.intitule_programme)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton edge="end" aria-label="Supprimer" onClick={() => handleDeleteProg(params.id)}>
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
        <Header title="Programmes" subtitle="Gestion de programmes" />

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
            Ajouter un programme
          </Button>
          <Box
            backgroundColor={colors.primary[400]}

          >
            
            <Dialog open={open}
              onClose={handleClose} 
            >
              <DialogTitle variant="h5" color="secondary">Ajouter un nouveau programme</DialogTitle>
              <DialogContent >
                <form onSubmit={handleSubmit}>

                  <TextField
                    label="Intitule du programme"
                    name="intitule_programme"
                    fullWidth
                    margin="normal"
                    required={true}
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateField']}>
                      <DateField required={true} name="date_debut" label="Date début du programme" format="YYYY-MM-DD" sx={{ width: 552 }} value={startDate} onChange={handleStartDateChange} />
                    </DemoContainer>
                  </LocalizationProvider>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateField']}>
                      <DateField required={true} name="date_fin" label="Date fin du programme" format="YYYY-MM-DD" sx={{ width: 552, mt: 1 }}  minDate={startDate} />
                    </DemoContainer>
                  </LocalizationProvider>
                  <TextField
                    label="Cout global"
                    name="cout_global"
                    fullWidth
                    type="number"
                    inputProps={{ min: 0 }}
                    margin="normal"
                    required={true}
                  />
                  <TextField
                    label="Nombres de projets"
                    name="nombre_projets"
                    fullWidth
                    type="number"
                    inputProps={{ min: 0 }}
                    margin="normal"
                    required={true}
                  />

                  <FormControl style={{ marginTop: '16px' }} sx={{ width: 552 }}>
                    <InputLabel id="multi_user">Choisissez les fonctionnaires</InputLabel>
                    <Select
                      labelId="multi_user_label"
                      id="multi_user"
                      name="multi_user"
                      multiple
                      required={true}
                      value={selectedUsers}
                      onChange={(event) => {
                        console.log(event.target.value);
                        setSelectedUsers(event.target.value);
                      }}
                      input={<OutlinedInput label="Choisissez les fonctionnaires" />}
                      renderValue={(selected) =>
                        Array.isArray(selected)
                          ? selected.map(id => {
                            const user = listUser.find(user => user.id === id);
                            return user ? user.email : '';
                          }).join(", ")
                          : ""
                      }
                    >
                      {listUser.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          <Checkbox checked={selectedUsers.indexOf(user.id) > -1} />
                          <ListItemText primary={user.email} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Observation"
                    name="observation_programme"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
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

export default ProgrammeADM;