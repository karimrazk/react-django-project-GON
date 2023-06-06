import { MenuItem, Select, Box, Button, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, InputLabel, FormControl, Tooltip } from "@mui/material";
import { useState, useEffect } from 'react';
import Header from "../../components/Header";
import { useParams } from 'react-router-dom';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import moment from 'moment';
import { tokens } from "../../theme";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import StatBox from "../../components/StatBox";
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import VerifiedIcon from '@mui/icons-material/Verified';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { useNavigate } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { addProjet, deleteProjet, getProjectCount, getProjectsByProgramme, getMoyenneTauxAvancement } from "../../utils/api";
import FileExport from "../../components/Excelfile";


const ProgramDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [moyenne, setMoyenne] = useState([]);
  const navigate = useNavigate();
  const { id: id_programme, intitule_programme } = useParams();
  const [projectCount, setProjectCount] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSecteur, setSelectedSecteur] = useState("");
  const [SelectedStatusEtude, setSelectedStatusEtude] = useState("");
  const [SelectedStatusProjet, setSelectedStatusProjet] = useState("");
  const [startDateprev, setStartDateprev] = useState(null);
  const [startDatereel, setStartDatereel] = useState(null);
  const [minEndDateprev, setMinEndDateprev] = useState(null);
  const [minEndDatereel, setMinEndDatereel] = useState(null);


  const handleViewProj = (id, intitule_projet) => {
    navigate(`projetDetails/${id}/${intitule_projet}`);
  };
  const handleEditProj = (id, intitule_projet) => {
    navigate(`modifierProjet/${id}/${intitule_projet}`);
  };

  const handleStartPrevDateChange = (date) => {
    setStartDateprev(date);
    setMinEndDateprev(date);
  };
  const handleStartReelDateChange = (date) => {
    setStartDatereel(date);
    setMinEndDatereel(date);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formatDateString = (dateField) => {
    const formattedDate = moment(dateField.value).format('YYYY-MM-DD');
    return formattedDate;
  };

  const handleSubmit = async (event) => {
    let newProgramme = new Object();
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const dateFields = ['date_debut_previsionnelle', 'date_fin_previsionnelle', 'date_debut_reel', 'date_fin_reel'];
    dateFields.forEach((fieldName) => {
      const dateField = form.elements[fieldName];
      if (dateField && dateField.value) {
        const formattedDate = formatDateString(dateField);
        formData.set(fieldName, formattedDate);
      }
    });

    if (formData.get('date_debut_previsionnelle') < formData.get('date_fin_previsionnelle')) {
      if (SelectedStatusProjet == 'En cours de réalisation' || SelectedStatusProjet == 'Achevée') {
        if (formData.get('date_debut_reel') < formData.get('date_fin_reel')) {

          formData.append('secteur', selectedSecteur);
          try {
            newProgramme = await addProjet(formData, id_programme);

            setData([...data, newProgramme]);
            handleClose();
          } catch (error) {
            console.error(error);
          }
        } else alert("La date de début ne peut pas être supérieure à la date de fin");

      } else {
        formData.append('secteur', selectedSecteur);
        try {
          newProgramme = await addProjet(formData, id_programme);
          setData([...data, newProgramme]);
          handleClose();
        } catch (error) {
          console.error(error);
        }

      }
    } else alert("La date de début ne peut pas être supérieure à la date de fin");
  };

  const handleDeleteProj = (id) => {
    if (
      window.confirm(
        `Attention : Ce projet est associé à un programme et peut également être lié à des contributions de partenaires. La suppression de ce projet entraînera la suppression de toutes les données associées. Êtes-vous sûr de vouloir continuer ?`
      )
    ) {
      deleteProjet(id)
        .then(() => {
          setData(data.filter((row) => row.id !== id));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };


  useEffect(() => {
    getProjectCount(id_programme)
      .then(count => {
        setProjectCount(count);
      })
      .catch(error => {
        console.log(error);
      });
  }, [id_programme]);

  useEffect(() => {
    getProjectsByProgramme(id_programme)
      .then(response => {
        setData(response);
      })
      .catch(error => {
        console.log(error);
      });
  }, [id_programme]);

  useEffect(() => {
    getMoyenneTauxAvancement(id_programme)
      .then(response => {
        setMoyenne(response);
      })
      .catch(error => console.log(error));
  }, [id_programme]);

  const columns = [

    {
      field: "intitule_projet",
      headerName: "Intitule du project",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "budget_global",
      headerName: "Budget global (MAD)",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "date_debut_previsionnelle",
      headerName: "Date début prévisionnelle",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "date_fin_previsionnelle",
      headerName: "Date fin prévisionnelle",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "statue_etude",
      headerName: "Statut des études",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "statue_projet",
      headerName: "Statut du projet",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "moa",
      headerName: "MOA",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "moad",
      headerName: "MOAD",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "secteur",
      headerName: "Secteur",
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
          <Tooltip title="Cliquez ici pour plus de détails sur ce projet.">
            <IconButton edge="end" aria-label="View" onClick={() => handleViewProj(params.id, params.row.intitule_projet)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <IconButton edge="end" aria-label="Modifier" onClick={() => handleEditProj(params.id, params.row.intitule_projet)}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Supprimer">
            <IconButton edge="end" aria-label="Supprimer" onClick={() => handleDeleteProj(params.id)}>
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
        <Header title={intitule_programme} subtitle="Organisez et suivez l'avancement de vos projets" />

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              onClick={handleOpen}
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: '14px',
                fontWeight: 'bold',
                padding: '10px 20px',
                marginRight: '10px',
              }}
            >
              <AddIcon sx={{ mr: '10px' }} />
              Ajouter un projet
            </Button>
            <FileExport data={data}/>
          </Box>

          <Box
            backgroundColor={colors.primary[400]}
          >
            <Dialog open={open}
              onClose={handleClose}
            >
              <DialogTitle variant="h5" color="secondary">Ajouter un nouveau projet</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Intitule du projet"
                    name="intitule_projet"
                    fullWidth
                    margin="normal"
                    required
                  />
                  <TextField
                    label="Localisation"
                    name="localisation"
                    fullWidth
                    margin="normal"
                    required
                  />
                  <FormControl fullWidth style={{ marginTop: '16px' }}>
                    <InputLabel id="secteur-select">Secteur</InputLabel>
                    <Select
                      labelId="secteur-select-label"
                      id="secteur-select"
                      value={selectedSecteur}
                      label="Choisissez  un secteur"
                      required
                      onChange={(event) => {
                        setSelectedSecteur(event.target.value);
                      }}
                    >
                      <MenuItem value="" disabled>
                        Choisissez un secteur
                      </MenuItem>
                      <MenuItem value="Tourisme">Tourisme</MenuItem>
                      <MenuItem value="Economie sociale">Economie sociale</MenuItem>
                      <MenuItem value="Agriculture">Agriculture</MenuItem>
                      <MenuItem value="Sport">Sport</MenuItem>
                      <MenuItem value="Culture">Culture</MenuItem>
                    </Select>
                  </FormControl>
                  <Grid item xs={6}>
                    <TextField
                      label="Budget global"
                      name="budget_global"
                      fullWidth
                      inputProps={{ min: 0 }}
                      type="number"
                      margin="normal"
                      required
                    />
                  </Grid>

                  <Grid container spacing={1}>

                    <Grid item xs={6}>
                      <TextField
                        label="MOA"
                        name="moa"
                        fullWidth
                        margin="normal"
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="MOAD"
                        name="moad"
                        fullWidth
                        margin="normal"

                      />
                    </Grid>
                  </Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateField']}>
                      <DateField required name="date_debut_previsionnelle" label="Date début previsionnelle" format="YYYY-MM-DD" sx={{ width: 552, mt: 1 }} value={startDateprev} onChange={handleStartPrevDateChange} />

                    </DemoContainer>
                  </LocalizationProvider>

                  <LocalizationProvider dateAdapter={AdapterDayjs}  >
                    <DemoContainer components={['DateField']}>
                      <DateField required name="date_fin_previsionnelle" label="Date fin previsionnelle" format="YYYY-MM-DD" sx={{ width: 552, mt: 1 }} minDate={startDateprev} />

                    </DemoContainer>
                  </LocalizationProvider>

                  <FormControl fullWidth style={{ marginTop: '16px' }}>
                    <InputLabel id="statut-etude-select">Statut des études</InputLabel>
                    <Select
                      labelId="Statut-etude-select-label"
                      id="statut-etude-select"
                      value={SelectedStatusEtude}
                      label="Choisissez  le statut des études"
                      required
                      name="statue_etude"
                      onChange={(event) => {
                        setSelectedStatusEtude(event.target.value);
                      }}
                    >
                      <MenuItem value="" disabled>
                        Choisissez  le statut des études
                      </MenuItem>
                      <MenuItem value="Aucun">Aucun</MenuItem>
                      <MenuItem value="Planifié">Planifié</MenuItem>
                      <MenuItem value="En cours">En cours</MenuItem>
                      <MenuItem value="Achevée">Achevée</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth style={{ marginTop: '16px' }}>
                    <InputLabel id="statut-projet-select">Statut de projet</InputLabel>
                    <Select
                      labelId="Statut-projet-select-label"
                      id="statut-projet-select"
                      value={SelectedStatusProjet}
                      label="Choisissez  le statut de projet"
                      required
                      name="statue_projet"
                      onChange={(event) => {
                        setSelectedStatusProjet(event.target.value);
                      }}
                    >
                      <MenuItem value="" disabled>
                        Choisissez  le statut de projet
                      </MenuItem>
                      <MenuItem value="En cours de démarrage">En cours de démarrage</MenuItem>
                      <MenuItem value="Planifié">Planifié</MenuItem>
                      <MenuItem value="En cours de réalisation">En cours de réalisation</MenuItem>
                      <MenuItem value="Achevée">Achevée</MenuItem>
                    </Select>
                  </FormControl>
                  {SelectedStatusProjet == 'En cours de réalisation' || SelectedStatusProjet == 'Achevée' ?
                    <div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateField']}>
                          <DateField name="date_debut_reel" value={startDatereel} label="Date début réel" format="YYYY-MM-DD" sx={{ width: 552, mt: 1 }} onChange={handleStartReelDateChange} />
                        </DemoContainer>
                      </LocalizationProvider>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateField']}>
                          <DateField name="date_fin_reel" minDate={startDatereel} label="Date fin réel" format="YYYY-MM-DD" sx={{ width: 552, mt: 1 }} />
                        </DemoContainer>
                      </LocalizationProvider>

                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <TextField
                            label="Engagemet"
                            name="engagemet"
                            fullWidth
                            type="number"
                            inputProps={{ min: 0 }}
                            margin="normal"

                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Paiement"
                            name="paiement"
                            fullWidth
                            margin="normal"
                            type="number"
                            inputProps={{ min: 0 }}

                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Taux d'avancement"
                            name="taux_davancement"
                            fullWidth
                            type="number"
                            inputProps={{ min: 0 , max: 100}}
                            margin="normal"

                          />
                        </Grid>
                      </Grid>
                    </div>
                    : ''}
                  <TextField
                    label="Observation"
                    name="observation"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleClose} color="secondary">Annuler</Button>
                    <Button type="submit" color="secondary"    >Ajouter</Button>
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
        {/* ROW 1 */}
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={projectCount.count_all}
            subtitle="Nombre de projets"
            progress={projectCount.count_all / 100}
            icon={
              <BusinessCenterIcon
                sx={{ color: colors.greenAccent[400], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={projectCount.count_en_cours_demarrage}
            subtitle="En cours de démarrage"
            progress={projectCount.count_en_cours_demarrage / 100}
            icon={
              <RestartAltIcon
                sx={{ color: colors.greenAccent[400], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={projectCount.count_planifie}
            subtitle="Planifié"
            progress={projectCount.count_planifie / 100}
            icon={
              <QueryStatsIcon
                sx={{ color: colors.greenAccent[400], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={projectCount.count_en_cours_realisation}
            subtitle="En cours de réalisation"
            progress={projectCount.count_en_cours_realisation / 100}
            icon={
              <EventRepeatIcon
                sx={{ color: colors.greenAccent[400], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={projectCount.count_achevee}
            subtitle="Achevée"
            progress={projectCount.count_achevee / 100}
            icon={
              <VerifiedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={moyenne && moyenne.moyenne_taux_avancement ? moyenne.moyenne_taux_avancement.toFixed(2) : 0}
            subtitle="Taux d'avancement"
            progress={moyenne.moyenne_taux_avancement / 100}
            icon={
              <AutoGraphIcon
                sx={{ color: colors.greenAccent[400], fontSize: "26px" }}
              />
            }
          />
        </Box>
      </Box>

      <Box

        m="40px 0 0 0"
        height="70vh"
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

export default ProgramDetails;