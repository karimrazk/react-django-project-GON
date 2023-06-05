import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import React, { useEffect, useState, useRef } from "react";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import { getProgrammeById, getUsersEMPLOYE, updateProgramme } from "../../utils/api";
import dayjs from "dayjs";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useSnackbar } from 'notistack';



const FormProgramme = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id: id_programme, intitule_programme } = useParams();
  const [listUsers, setListUsers] = useState([]);
  const [programmeData, setProgrammeData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    getUsersEMPLOYE()
      .then((data) => setListUsers(data))
      .catch((error) => console.log(error));
  }, []);


  const handleFormSubmit = async (values) => {
    try {
      const selectedUsers = values.users.map((userId) => parseInt(userId, 10));
      const editedRow = { ...values, users: selectedUsers };  
      await updateProgramme(id_programme, editedRow);
      enqueueSnackbar('Les modifications apportées au programme ont été enregistrées avec succès!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error updating data!', { variant: 'error' });
    }
  };



  useEffect(() => {
    getProgrammeById(id_programme)
      .then((data) => setProgrammeData(data))
      .catch((error) => console.log(error));
  }, [id_programme]);



  const initialValues = {
    intitule_programme: '',
    date_debut: '',
    date_fin: '',
    cout_global: '',
    nombre_projets: '',
    users: [],
    observation_programme: '',
  };

  return (
    <Box m="20px">
      <Header title="Modifier les informations du programme" subtitle="Transformez votre programme avec des informations à jour !" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setValues,
        }) => {
          useEffect(() => {
            if (programmeData) {
              const { intitule_programme, date_debut, date_fin, cout_global, nombre_projets, users, observation_programme } = programmeData;
              setValues({
                intitule_programme: intitule_programme || "",
                date_debut: date_debut ? dayjs(date_debut).format("YYYY-MM-DD") : "",
                date_fin: date_fin ? dayjs(date_fin).format("YYYY-MM-DD") : "",
                cout_global: cout_global || "",
                nombre_projets: nombre_projets || "",
                users: users || [],
                observation_programme: observation_programme || "",
              });
            }
          }, [programmeData, setValues]);
          return (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Intitule du programme"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.intitule_programme}
                  name="intitule_programme"
                  error={!!touched.intitule_programme && !!errors.intitule_programme}
                  helperText={touched.intitule_programme && errors.intitule_programme}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Cout global"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.cout_global}
                  name="cout_global"
                  error={!!touched.cout_global && !!errors.cout_global}
                  helperText={touched.cout_global && errors.cout_global}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Nombre de projets"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.nombre_projets}
                  name="nombre_projets"
                  error={!!touched.nombre_projets && !!errors.nombre_projets}
                  helperText={touched.nombre_projets && errors.nombre_projets}
                  sx={{ gridColumn: "span 2" }}
                />
                <FormControl fullWidth  sx={{ gridColumn: "span 2" }} variant="filled">
                  <InputLabel id="users-label">Fonctionnaires</InputLabel>
                  <Select
                    labelId="users-label"
                    multiple
                    value={values.users}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="users"
                    renderValue={(selected) =>
                      selected
                        .map((userId) => listUsers.find((user) => user.id === userId)?.email)
                        .join(", ")
                    }
                    error={!!touched.users && !!errors.users}
                    helperText={touched.users && errors.users}
                    sx={{ gridColumn: "span 2" }}
                   
                  >
                    {listUsers.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  label="Date début"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.date_debut}
                  name="date_debut"
                  error={!!touched.date_debut && !!errors.date_debut}
                  helperText={touched.date_debut && errors.date_debut}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  label="Date fin"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.date_fin}
                  name="date_fin"
                  error={!!touched.date_fin && !!errors.date_fin}
                  helperText={touched.date_fin && errors.date_fin}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="filled"
                  type="text"
                  label="Observation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.observation_programme}
                  name="observation_programme"
                  error={!!touched.observation_programme && !!errors.observation_programme}
                  helperText={touched.observation_programme && errors.observation_programme}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Modifier
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};


const checkoutSchema = yup.object().shape({
  intitule_programme: yup.string().required("Requis"),

  date_debut: yup
  .date()
  .typeError("Date invalide")
  .required("Requis")
  .max(yup.ref("date_fin"), "La date de début ne peut pas être supérieure à la date de fin"),

  date_fin: yup
  .date()
  .typeError("Date invalide")
  .required("Requis")
  .min(yup.ref("date_debut"), "La date de fin ne peut pas être inférieure à la date de début"),

  cout_global: yup
    .number()
    .typeError("Le cout global doit être un nombre")
    .required("Requis"),
  nombre_projets: yup
    .number()
    .typeError("Le nombre de projets doit être un nombre")
    .required("Requis")
    .min(0, "Le nombre de projets doit être d'au moins 0"), 
  observation_programme: yup.string().required("Requis"),
  users: yup.array().required("Requis").min(1, "Sélectionnez au moins un utilisateur"),
});


export default FormProgramme;