import { Box, Button, TextField,Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../utils/api";
import { useSnackbar } from 'notistack';



const FormFonctionnaire = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id: id_fonctionnaire} = useParams();
  const [User, setUser] = useState([]);
  const [fonctionnaireData, setFonctionnaireData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();


  const handleFormSubmit = async (values) => {
    try {
      await updateUser(id_fonctionnaire, values);
      enqueueSnackbar('Les modifications apportées au fonctionnaire ont été enregistrées avec succès!', { variant: 'success' });
    } catch (error) {
 if (error.message) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } else {
      enqueueSnackbar('Une erreur s\'est produite lors de la mise à jour du fonctionnaire.', { variant: 'error' });
    }    }
  };



  useEffect(() => {
    getUserById(id_fonctionnaire)
      .then((data) => setFonctionnaireData(data))
      .catch((error) => console.log(error));
  }, [id_fonctionnaire]);



  const initialValues = {
    last_name: '',
    first_name: '',
    email: '',
    role: '',
    division: '',
    service: '',
    password: '',
  };

  return (
    <Box m="20px">
      <Header title="Modifier les informations du fonctionnaire" subtitle="Transformez le compte du fonctionnaire avec des informations à jour !" />
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
          setFieldValue,
        }) => {
            useEffect(() => {
                if (fonctionnaireData) {
                  const { last_name, first_name, email, role, division, service } = fonctionnaireData;
                  setFieldValue("last_name", last_name || "");
                  setFieldValue("first_name", first_name || "");
                  setFieldValue("email", email || "");
                  setFieldValue("role", role || "");
                  setFieldValue("division", division || "");
                  setFieldValue("service", service || "");
                }
              }, [fonctionnaireData, setFieldValue]);
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
                  label="Nom"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.last_name}
                  name="last_name"
                  error={!!touched.last_name && !!errors.last_name}
                  helperText={touched.last_name && errors.last_name}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Prénom"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.first_name}
                  name="first_name"
                  error={!!touched.first_name && !!errors.first_name}
                  helperText={touched.first_name && errors.first_name}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="E-mail"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                 <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Mot de passe"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
                <FormControl fullWidth  sx={{ gridColumn: "span 4" }} variant="filled">
                    <InputLabel id="role-select">Role</InputLabel>
                    <Select
                      labelId="role-select-label"
                      value={values.role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="role"
                      error={!!touched.role && !!errors.role}
                      helpertext={touched.role && errors.role}
                    >
                      <MenuItem value="" disabled>
                        Choisissez un role
                      </MenuItem>
                      <MenuItem value="EMPLOYE">EMPLOYE</MenuItem>
                      <MenuItem value="ADMIN">ADMIN</MenuItem>
                      <MenuItem value="SUPERVISEUR">SUPERVISEUR</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth  sx={{ gridColumn: "span 4" }} variant="filled">
                    <InputLabel id="division-select">Division</InputLabel>
                    <Select
                      labelId="division-select-label"
                      value={values.division}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="division"
                      error={!!touched.division && !!errors.division}
                      helpertext={touched.division && errors.division}
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
                <FormControl fullWidth  sx={{ gridColumn: "span 4" }} variant="filled">
                    <InputLabel id="service-select">Service</InputLabel>
                    <Select
                      labelId="service-select-label"
                      value={values.service}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="service"
                      error={!!touched.service && !!errors.service}
                      helpertext={touched.service && errors.service}
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
  last_name: yup.string().required("Requis"),
  first_name: yup.string().required("Requis"),
  email: yup.string().email().required("Requis"),
  service: yup.string().required("Requis"),
  division: yup.string().required("Requis"),
  role: yup.string().required("Requis"),
//   password: yup.string().required("requis"),
  password: yup.string()
  .required("Requis")
  .min(8, "Le mot de passe est trop court - il doit contenir au moins 8 caractères!"),

});


export default FormFonctionnaire;